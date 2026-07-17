import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ws from 'ws';

const envContent = readFileSync(resolve('.env.local'), 'utf-8');
const env: Record<string, string> = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
}

const supabaseUrl = env.VITE_SUPABASE_URL!;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY!;
const cloudName = env.VITE_CLOUDINARY_CLOUD_NAME!;
const uploadPreset = env.VITE_CLOUDINARY_UPLOAD_PRESET!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: { transport: ws as any },
});

const BASE64_RE = /^data:image\//;

async function uploadToCloudinary(base64Url: string): Promise<string> {
  if (!BASE64_RE.test(base64Url)) return base64Url;

  const match = base64Url.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error(`Invalid base64: ${base64Url.slice(0, 50)}...`);

  const mimeType = match[1];
  const base64Data = match[2];
  const buffer = Buffer.from(base64Data, 'base64');
  const ext = mimeType.split('/')[1] || 'jpg';

  const formData = new FormData();
  formData.append('file', new Blob([buffer], { type: mimeType }), `image.${ext}`);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Upload failed: ${JSON.stringify(body)}`);
  }

  const data = await res.json() as { secure_url: string };
  return data.secure_url;
}

async function migrateProducts() {
  const { data: products, error } = await supabase.from('products').select('id, images');
  if (error) throw error;
  if (!products || products.length === 0) {
    console.log('Products: no records found\n');
    return;
  }

  let migrated = 0;
  for (const product of products) {
    const images = product.images as { id: string; url: string; alt: string; isPrimary: boolean }[] | null;
    if (!images || images.length === 0) continue;

    let changed = false;
    const newImages = [];
    for (const img of images) {
      if (BASE64_RE.test(img.url)) {
        console.log(`  [${product.id}] Uploading ${img.id}...`);
        try {
          img.url = await uploadToCloudinary(img.url);
          changed = true;
          migrated++;
        } catch (err: any) {
          console.error(`  [${product.id}] Failed: ${err.message}`);
        }
      }
      newImages.push(img);
    }

    if (changed) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: newImages })
        .eq('id', product.id);
      if (updateError) {
        console.error(`  [${product.id}] DB update failed: ${updateError.message}`);
      } else {
        console.log(`  [${product.id}] Updated`);
      }
    }
  }
  console.log(`Products: ${migrated} images migrated\n`);
}

async function migrateHeroBanners() {
  const { data: settings, error } = await supabase
    .from('site_settings')
    .select('id, hero_banners')
    .eq('id', 1)
    .single();
  if (error) {
    console.error('Failed to fetch site_settings:', error.message);
    return;
  }
  if (!settings) return;

  const banners = settings.hero_banners as { id: string; url: string; isActive: boolean }[] | null;
  if (!banners || banners.length === 0) {
    console.log('Hero banners: no banners found\n');
    return;
  }

  let migrated = 0;
  let changed = false;
  for (const banner of banners) {
    if (BASE64_RE.test(banner.url)) {
      console.log(`  Uploading banner ${banner.id}...`);
      try {
        banner.url = await uploadToCloudinary(banner.url);
        changed = true;
        migrated++;
      } catch (err: any) {
        console.error(`  Failed: ${err.message}`);
      }
    }
  }

  if (changed) {
    const { error: updateError } = await supabase
      .from('site_settings')
      .update({ hero_banners: banners })
      .eq('id', 1);
    if (updateError) {
      console.error('Failed to update site_settings:', updateError.message);
    } else {
      console.log('Updated site_settings');
    }
  }
  console.log(`Hero banners: ${migrated} images migrated\n`);
}

async function migrateReviews() {
  const { data: reviews, error } = await supabase.from('product_reviews').select('id, images');
  if (error) throw error;
  if (!reviews || reviews.length === 0) {
    console.log('Reviews: no records found\n');
    return;
  }

  let migrated = 0;
  for (const review of reviews) {
    const images = review.images as string[] | null;
    if (!images || images.length === 0) continue;

    let changed = false;
    const newImages: string[] = [];
    for (const url of images) {
      if (BASE64_RE.test(url)) {
        console.log(`  [${review.id}] Uploading review image...`);
        try {
          newImages.push(await uploadToCloudinary(url));
          changed = true;
          migrated++;
        } catch (err: any) {
          console.error(`  [${review.id}] Failed: ${err.message}`);
          newImages.push(url);
        }
      } else {
        newImages.push(url);
      }
    }

    if (changed) {
      const { error: updateError } = await supabase
        .from('product_reviews')
        .update({ images: newImages })
        .eq('id', review.id);
      if (updateError) {
        console.error(`  [${review.id}] DB update failed: ${updateError.message}`);
      } else {
        console.log(`  [${review.id}] Updated`);
      }
    }
  }
  console.log(`Reviews: ${migrated} images migrated\n`);
}

async function main() {
  console.log('Starting image migration to Cloudinary...\n');

  try {
    await migrateProducts();
    await migrateHeroBanners();
    await migrateReviews();
    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

main();
