// ============================================
// UI Store (Zustand)
// ============================================

import { create } from 'zustand';
import type { Toast } from '../types/common';

interface UIStore {
  // Mobile menu
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;

  // Search
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  // Admin sidebar
  isAdminSidebarCollapsed: boolean;
  toggleAdminSidebar: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Generic modal
  activeModal: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;

  // Page loading
  isPageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
}

let toastId = 0;

export const useUIStore = create<UIStore>()((set) => ({
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  isAdminSidebarCollapsed: false,
  toggleAdminSidebar: () => set((s) => ({ isAdminSidebarCollapsed: !s.isAdminSidebarCollapsed })),

  toasts: [],
  addToast: (toast) => {
    const id = `toast-${++toastId}`;
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    const duration = toast.duration ?? 5000;
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  activeModal: null,
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),

  isPageLoading: false,
  setPageLoading: (loading) => set({ isPageLoading: loading }),
}));
