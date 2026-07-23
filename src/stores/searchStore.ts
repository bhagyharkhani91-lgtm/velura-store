// ============================================
// Search Store (Zustand)
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchStore {
  query: string;
  recentSearches: string[];
  setQuery: (query: string) => void;
  addToRecent: (term: string) => void;
  removeFromRecent: (term: string) => void;
  clearRecent: () => void;
}

const MAX_RECENT = 8;

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      query: '',
      recentSearches: [],

      setQuery: (query) => set({ query }),

      addToRecent: (term) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        set((state) => ({
          recentSearches: [
            trimmed,
            ...state.recentSearches.filter((s) => s !== trimmed),
          ].slice(0, MAX_RECENT),
        }));
      },

      removeFromRecent: (term) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s !== term),
        }));
      },

      clearRecent: () => set({ recentSearches: [] }),
    }),
    { name: 'personal-care-search', partialize: (s) => ({ recentSearches: s.recentSearches }) }
  )
);
