import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId, slugify } from '../utils';

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CMSState {
  pages: CMSPage[];
  addPage: (page: Omit<CMSPage, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePage: (id: string, updates: Partial<CMSPage>) => void;
  deletePage: (id: string) => void;
  getPageBySlug: (slug: string) => CMSPage | undefined;
}

// Initial mock pages so the user has something to look at immediately
const initialPages: CMSPage[] = [
  {
    id: 'page-1',
    title: 'Refund Policy',
    slug: 'refund-policy',
    content: '<h2>Our Refund Policy</h2><p>We offer a 30-day return policy for unopened items...</p>',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page-2',
    title: 'About Us',
    slug: 'about-us',
    content: '<h2>About Adult Store</h2><p>Welcome to Adult Store, your premium destination...</p>',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const useCMSStore = create<CMSState>()(
  persist(
    (set, get) => ({
      pages: initialPages,
      
      addPage: (pageData) => set((state) => {
        const now = new Date().toISOString();
        // Ensure slug is valid
        const slug = slugify(pageData.slug || pageData.title);
        
        const newPage: CMSPage = {
          ...pageData,
          slug,
          id: `page-${generateId()}`,
          createdAt: now,
          updatedAt: now,
        };
        
        return {
          pages: [...state.pages, newPage],
        };
      }),
      
      updatePage: (id, updates) => set((state) => ({
        pages: state.pages.map((p) => 
          p.id === id 
            ? { ...p, ...updates, updatedAt: new Date().toISOString() } 
            : p
        ),
      })),
      
      deletePage: (id) => set((state) => ({
        pages: state.pages.filter((p) => p.id !== id),
      })),
      
      getPageBySlug: (slug) => {
        return get().pages.find(p => p.slug === slug);
      }
    }),
    {
      name: 'adult-store-cms',
    }
  )
);
