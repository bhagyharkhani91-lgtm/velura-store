// ============================================
// Common Types
// ============================================

export interface PaginationInfo {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface SortOption {
  label: string;
  value: string;
  direction: 'asc' | 'desc';
}

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  rating: number | null;
  inStock: boolean;
  onSale: boolean;
  sortBy: string;
  search: string;
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  isVerified: boolean;
  helpfulCount: number;
  images?: string[];
  createdAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  code?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  banner?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  width?: number;
  height?: number;
  folder: string;
  alt?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  sections: CMSSection[];
  seoTitle: string;
  seoDescription: string;
  status: 'published' | 'draft' | 'scheduled';
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CMSSection {
  id: string;
  type: 'hero' | 'text' | 'image' | 'video' | 'products' | 'categories' | 'banner' | 'faq' | 'newsletter' | 'testimonial' | 'custom';
  title?: string;
  content: Record<string, unknown>;
  sortOrder: number;
  isVisible: boolean;
}
