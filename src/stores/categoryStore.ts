import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { slugify } from '../utils';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'slug'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryBySlug: (slug: string) => Category | undefined;
}

const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Men Care', slug: 'men-toys', description: 'Personal care products for men.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-2', name: 'Women Care', slug: 'women-toys', description: 'Personal care products for women.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-3', name: 'Couple Wellness', slug: 'couple-toys', description: 'Wellness products for couples.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-4', name: 'Massagers', slug: 'vibrators', description: 'Premium personal massagers.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-5', name: 'Wellness Tools', slug: 'dildos', description: 'Personal wellness and care tools.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-6', name: 'Accessories', slug: 'bondage', description: 'Wellness accessories and aids.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-7', name: 'Health Devices', slug: 'anal-toys', description: 'Personal health and wellness devices.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-8', name: 'Lotions & Oils', slug: 'lubes-and-lotions', description: 'Premium body lotions and massage oils.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-9', name: 'Apparel', slug: 'lingerie', description: 'Comfortable apparel for all bodies.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-10', name: 'Sale', slug: 'sale', description: 'Discounted products and special offers.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-11', name: 'Fresh Picks', slug: 'fresh-picks', description: 'Our newest and trending arrivals.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-12', name: 'Top Men', slug: 'top-men', description: 'Our top premium collection for men.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-13', name: 'Top Women', slug: 'top-women', description: 'Our top premium collection for women.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: initialCategories,
      isLoading: false,
      error: null,
      initialized: false,

      fetchCategories: async () => {
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.from('categories').select('*').order('created_at');
          if (error) throw error;

          if (data && data.length > 0) {
            const mapped: Category[] = data.map((c: any) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              description: c.description || '',
              createdAt: c.created_at,
              updatedAt: c.created_at,
            }));
            set({ categories: mapped, isLoading: false, initialized: true });
          } else {
            const seedPayload = initialCategories.map(c => ({
              name: c.name,
              slug: c.slug,
              description: c.description,
            }));

            const { error: seedError } = await supabase.from('categories').insert(seedPayload);
            if (seedError) throw seedError;

            const { data: seeded, error: refetchErr } = await supabase.from('categories').select('*').order('created_at');
            if (refetchErr) throw refetchErr;

            if (seeded) {
              const mapped: Category[] = seeded.map((c: any) => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
                description: c.description || '',
                createdAt: c.created_at,
                updatedAt: c.created_at,
              }));
              set({ categories: mapped, isLoading: false, initialized: true });
            }
          }
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      addCategory: async (categoryData) => {
        const slug = slugify(categoryData.name);
        const { error } = await supabase.from('categories').insert([{
          name: categoryData.name,
          slug,
          description: categoryData.description,
        }]);
        if (error) throw error;
        await get().fetchCategories();
      },

      updateCategory: async (id, updates) => {
        const dbUpdates: Record<string, any> = {};
        if (updates.name !== undefined) {
          dbUpdates.name = updates.name;
          dbUpdates.slug = slugify(updates.name);
        }
        if (updates.description !== undefined) dbUpdates.description = updates.description;

        const { error } = await supabase.from('categories').update(dbUpdates).eq('id', id);
        if (error) throw error;
        await get().fetchCategories();
      },

      deleteCategory: async (id) => {
        const category = get().categories.find(c => c.id === id);

        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;

        if (category) {
          const { data: affectedProducts } = await supabase
            .from('products')
            .select('id, category_ids')
            .contains('category_ids', [category.slug]);

          if (affectedProducts && affectedProducts.length > 0) {
            await Promise.all(
              affectedProducts.map((p: any) => {
                const newIds = (p.category_ids || []).filter((s: string) => s !== category.slug);
                return supabase.from('products').update({ category_ids: newIds }).eq('id', p.id);
              })
            );
          }
        }

        await get().fetchCategories();
      },

      getCategoryBySlug: (slug) => {
        return get().categories.find(c => c.slug === slug);
      }
    }),
    {
      name: 'personal-care-categories',
      partialize: (state) => ({ categories: state.categories }),
    }
  )
);
