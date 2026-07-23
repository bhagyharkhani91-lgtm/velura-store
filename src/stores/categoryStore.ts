import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId, slugify } from '../utils';

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
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'slug'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
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
      
      addCategory: (categoryData) => set((state) => {
        const now = new Date().toISOString();
        const slug = slugify(categoryData.name);
        
        const newCategory: Category = {
          ...categoryData,
          slug,
          id: `cat-${generateId()}`,
          createdAt: now,
          updatedAt: now,
        };
        
        return {
          categories: [...state.categories, newCategory],
        };
      }),
      
      updateCategory: (id, updates) => set((state) => ({
        categories: state.categories.map((c) => 
          c.id === id 
            ? { ...c, ...updates, updatedAt: new Date().toISOString() } 
            : c
        ),
      })),
      
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      })),
      
      getCategoryBySlug: (slug) => {
        return get().categories.find(c => c.slug === slug);
      }
    }),
    {
      name: 'personal-care-categories',
    }
  )
);
