// ============================================
// Wishlist Store (Zustand)
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: string[]; // product IDs
  toggleItem: (productId: string) => void;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  clearAll: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (productId) => {
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items.filter((id) => id !== productId)
            : [...state.items, productId],
        }));
      },

      addItem: (productId) => {
        set((state) => ({
          items: state.items.includes(productId) ? state.items : [...state.items, productId],
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }));
      },

      hasItem: (productId) => get().items.includes(productId),
      clearAll: () => set({ items: [] }),
    }),
    { name: 'adult-store-wishlist' }
  )
);
