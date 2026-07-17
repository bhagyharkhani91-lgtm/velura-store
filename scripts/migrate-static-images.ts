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

const supabase = createClient(env.VITE_SUPABASE_URL!, env.VITE_SUPABASE_ANON_KEY!, {
  realtime: { transport: ws as any },
});
const cloudName = env.VITE_CLOUDINARY_CLOUD_NAME!;
const uploadPreset = env.VITE_CLOUDINARY_UPLOAD_PRESET!;

const FILES: { path: string; dbPath: string }[] = [
  { path: 'public/banners/hero_couples_ring.png', dbPath: '/banners/hero_couples_ring.png' },
  { path: 'public/banners/hero_luxury_dildo.png', dbPath: '/banners/hero_luxury_dildo.png' },
  { path: 'public/banners/hero_luxury_vibe.png', dbPath: '/banners/hero_luxury_vibe.png' },
  { path: 'public/banners/hero_massage_oil.png', dbPath: '/banners/hero_massage_oil.png' },
  { path: 'public/images/products/premium_1.webp', dbPath: '/images/products/premium_1.webp' },
  { path: 'public/images/products/premium_2.webp', dbPath: '/images/products/premium_2.webp' },
  { path: 'public/images/products/premium_3.webp', dbPath: '/images/products/premium_3.webp' },
  { path: 'public/images/products/premium_4.webp', dbPath: '/images/products/premium_4.webp' },
  { path: 'public/images/products/premium_5.webp', dbPath: '/images/products/premium_5.webp' },
];

async function uploadFile(filePath: string): Promise<string> {
  const buffer = readFileSync(resolve(filePath));
  const fileName = filePath.split('/').pop()!;
  const ext = fileName.split('.').pop()!;
  const mimeMap: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' };

  const formData = new FormData();
  formData.append('file', new Blob([buffer], { type: mimeMap[ext] || 'image/png' }), fileName);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Upload failed for ${filePath}: ${JSON.stringify(body)}`);
  }

  const data = await res.json() as { secure_url: string };
  return data.secure_url;
}

function replaceUrl(obj: any, mapping: Map<string, string>): boolean {
  let changed = false;
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === 'object' && item !== null && item.url && mapping.has(item.url)) {
        item.url = mapping.get(item.url)!;
        changed = true;
      }
      if (typeof item === 'string' && mapping.has(item)) {
        changed = true;
        // can't reassign string in-place, handled in caller
      }
    }
  }
  return changed;
}

async function main() {
  console.log('Uploading 9 images to Cloudinary...\n');

  const mapping = new Map<string, string>();
  for (const file of FILES) {
    try {
      console.log(`  Uploading ${file.dbPath}...`);
      const cloudUrl = await uploadFile(file.path);
      mapping.set(file.dbPath, cloudUrl);
      console.log(`    -> ${cloudUrl}`);
    } catch (err: any) {
      console.error(`  FAILED ${file.dbPath}: ${err.message}`);
    }
  }

  console.log(`\nUploaded ${mapping.size}/${FILES.length} files.\n`);
  console.log('Updating database...\n');

  // Update hero banners in site_settings
  const { data: settings } = await supabase.from('site_settings').select('hero_banners').eq('id', 1).single();
  if (settings?.hero_banners) {
    let changed = false;
    const banners = settings.hero_banners as { id: string; url: string; isActive: boolean }[];
    for (const banner of banners) {
      if (mapping.has(banner.url)) {
        banner.url = mapping.get(banner.url)!;
        changed = true;
        console.log(`  Banner ${banner.id}: ${mapping.get(banner.url)!}`);
      }
    }
    if (changed) {
      const { error } = await supabase.from('site_settings').update({ hero_banners: banners }).eq('id', 1);
      if (error) console.error('  Failed to update site_settings:', error.message);
      else console.log('  site_settings updated');
    }
  }

  // Update products
  const { data: products } = await supabase.from('products').select('id, name, images');
  if (products) {
    let updated = 0;
    for (const product of products) {
      const images = product.images as { id: string; url: string; alt: string; isPrimary: boolean }[] | null;
      if (!images || images.length === 0) continue;
      let changed = false;
      for (const img of images) {
        if (mapping.has(img.url)) {
          img.url = mapping.get(img.url)!;
          changed = true;
        }
      }
      if (changed) {
        const { error } = await supabase.from('products').update({ images }).eq('id', product.id);
        if (error) console.error(`  Failed ${product.id}:`, error.message);
        else updated++;
      }
    }
    console.log(`  ${updated} products updated`);
  }

  console.log('\nDone!');
}

main().catch(e => { console.error(e); process.exit(1); });
