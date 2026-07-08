// ============================================
// Filter Store (Zustand)
// ============================================

import { create } from 'zustand';

interface FilterStore {
  categories: string[];
  priceRange: [number, number];
  rating: number | null;
  inStock: boolean;
  onSale: boolean;
  sortBy: string;

  setCategories: (categories: string[]) => void;
  toggleCategory: (categoryId: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setRating: (rating: number | null) => void;
  setInStock: (inStock: boolean) => void;
  setOnSale: (onSale: boolean) => void;
  setSortBy: (sortBy: string) => void;
  resetFilters: () => void;
  hasActiveFilters: () => boolean;
}

const INITIAL_STATE = {
  categories: [] as string[],
  priceRange: [0, 500] as [number, number],
  rating: null as number | null,
  inStock: false,
  onSale: false,
  sortBy: 'featured',
};

export const useFilterStore = create<FilterStore>()((set, get) => ({
  ...INITIAL_STATE,

  setCategories: (categories) => set({ categories }),
  toggleCategory: (categoryId) => set((s) => ({
    categories: s.categories.includes(categoryId)
      ? s.categories.filter((c) => c !== categoryId)
      : [...s.categories, categoryId],
  })),
  setPriceRange: (priceRange) => set({ priceRange }),
  setRating: (rating) => set({ rating }),
  setInStock: (inStock) => set({ inStock }),
  setOnSale: (onSale) => set({ onSale }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set(INITIAL_STATE),
  hasActiveFilters: () => {
    const s = get();
    return (
      s.categories.length > 0 ||
      s.priceRange[0] !== 0 ||
      s.priceRange[1] !== 500 ||
      s.rating !== null ||
      s.inStock ||
      s.onSale ||
      s.sortBy !== 'featured'
    );
  },
}));
