// ============================================
// Product Types
// ============================================

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  color?: string;
  size?: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  inStock: boolean;
  stockCount: number;
}

export interface ProductFeature {
  icon: string;
  label: string;
  description: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  brandId?: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  features: ProductFeature[];
  materials: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  status: 'published' | 'draft' | 'archived';
  hasDiscreetShipping?: boolean;
  warrantyText?: string;
  shippingCharge?: number;
}
