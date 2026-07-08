// ============================================
// Category Types
// ============================================

export interface Subcategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  subcategories: Subcategory[];
  productCount: number;
  isFeatured: boolean;
  sortOrder: number;
}
