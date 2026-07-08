import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Product } from '../types/product';
import { slugify } from '../utils';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'slug'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;

      const formattedProducts: Product[] = (data || []).map(d => ({
        id: d.id,
        slug: d.slug,
        name: d.name,
        shortDescription: d.short_description || '',
        description: d.description || '',
        categoryId: d.category_id,
        subcategoryId: d.subcategory_id,
        brandId: d.brand_id,
        price: Number(d.price),
        compareAtPrice: d.compare_at_price ? Number(d.compare_at_price) : undefined,
        images: d.images || [],
        variants: d.variants || [],
        features: d.features || [],
        materials: d.materials || [],
        tags: d.tags || [],
        rating: Number(d.rating || 0),
        reviewCount: Number(d.review_count || 0),
        inStock: d.in_stock,
        stockCount: d.stock_count,
        isNew: d.is_new,
        isBestSeller: d.is_best_seller,
        isFeatured: d.is_featured,
        isOnSale: d.is_on_sale,
        seoTitle: d.seo_title || '',
        seoDescription: d.seo_description || '',
        hasDiscreetShipping: d.has_discreet_shipping,
        warrantyText: d.warranty_text || '',
        status: d.status,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
        publishedAt: d.published_at
      }));

      set({ products: formattedProducts, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addProduct: async (productData) => {
    try {
      // Set timestamps if they are new, though they aren't strictly required here
      const slug = slugify(productData.name);
      
      const dbProduct = {
        slug: slug,
        name: productData.name,
        short_description: productData.shortDescription,
        description: productData.description,
        category_id: productData.categoryId || null, // null if empty string
        price: productData.price,
        compare_at_price: productData.compareAtPrice,
        images: productData.images,
        variants: productData.variants,
        features: productData.features,
        materials: productData.materials,
        tags: productData.tags,
        in_stock: productData.inStock,
        stock_count: productData.stockCount,
        is_new: productData.isNew,
        is_best_seller: productData.isBestSeller,
        is_featured: productData.isFeatured,
        is_on_sale: productData.isOnSale,
        status: productData.status || 'draft'
      };

      const { error } = await supabase.from('products').insert([dbProduct]).select().single();
      if (error) throw error;

      // Re-fetch to ensure sync, or just push to state
      get().fetchProducts();
    } catch (err) {
      console.error("Error adding product", err);
      throw err;
    }
  },

  updateProduct: async (id, updates) => {
    try {
      // Map JS camelCase to Postgres snake_case here as needed for updates
      // This is simplified, ideally you map each updated field
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.name) { dbUpdates.name = updates.name; dbUpdates.slug = slugify(updates.name); }
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.images) dbUpdates.images = updates.images;
      if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId === '' ? null : updates.categoryId;
      if (updates.shortDescription !== undefined) dbUpdates.short_description = updates.shortDescription;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.compareAtPrice !== undefined) dbUpdates.compare_at_price = updates.compareAtPrice;
      if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
      if (updates.stockCount !== undefined) dbUpdates.stock_count = updates.stockCount;
      if (updates.isNew !== undefined) dbUpdates.is_new = updates.isNew;
      if (updates.isBestSeller !== undefined) dbUpdates.is_best_seller = updates.isBestSeller;
      if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;
      if (updates.isOnSale !== undefined) dbUpdates.is_on_sale = updates.isOnSale;

      const { error } = await supabase.from('products').update(dbUpdates).eq('id', id);
      if (error) throw error;
      
      get().fetchProducts();
    } catch (err) {
      console.error("Error updating product", err);
      throw err;
    }
  },

  deleteProduct: async (id) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } catch (err) {
      console.error("Error deleting product", err);
      throw err;
    }
  },

  getProductBySlug: (slug) => {
    return get().products.find((p) => p.slug === slug);
  },

  getProductsByCategory: (categoryId) => {
    return get().products.filter((p) => p.categoryId === categoryId);
  }
}));
