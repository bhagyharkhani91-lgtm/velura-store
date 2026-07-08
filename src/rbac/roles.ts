// ============================================
// RBAC — Role Definitions
// ============================================

import { ALL_PERMISSIONS, PERMISSIONS, PERMISSION_GROUPS, type Permission } from './permissions';

export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean; // System roles cannot be deleted
  createdAt: string;
}

export const ROLES: Record<string, Role> = {
  SUPER_ADMIN: {
    id: 'role-super-admin',
    name: 'Super Admin',
    slug: 'super-admin',
    description: 'Unrestricted access to the entire platform',
    permissions: ALL_PERMISSIONS,
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },

  ADMIN: {
    id: 'role-admin',
    name: 'Admin',
    slug: 'admin',
    description: 'Full access except API keys, system logs, and security settings',
    permissions: ALL_PERMISSIONS.filter(p => 
      p !== PERMISSIONS.API_KEYS && 
      p !== PERMISSIONS.SYSTEM_LOGS && 
      p !== PERMISSIONS.SETTINGS_SECURITY &&
      p !== PERMISSIONS.FEATURE_FLAGS
    ),
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },

  STORE_MANAGER: {
    id: 'role-store-manager',
    name: 'Store Manager',
    slug: 'store-manager',
    description: 'Manage products, categories, orders, inventory, and reviews',
    permissions: [
      ...PERMISSION_GROUPS.products,
      ...PERMISSION_GROUPS.categories,
      ...PERMISSION_GROUPS.orders,
      ...PERMISSION_GROUPS.inventory,
      ...PERMISSION_GROUPS.reviews,
      PERMISSIONS.MEDIA_UPLOAD,
      PERMISSIONS.MEDIA_READ,
      PERMISSIONS.ANALYTICS_VIEW,
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.DASHBOARD_ADMIN,
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },

  MARKETING_MANAGER: {
    id: 'role-marketing-manager',
    name: 'Marketing Manager',
    slug: 'marketing-manager',
    description: 'Manage campaigns, coupons, banners, promotions, and homepage',
    permissions: [
      ...PERMISSION_GROUPS.marketing,
      ...PERMISSION_GROUPS.homepage,
      PERMISSIONS.PRODUCT_READ,
      PERMISSIONS.CATEGORY_READ,
      PERMISSIONS.MEDIA_UPLOAD,
      PERMISSIONS.MEDIA_READ,
      PERMISSIONS.ANALYTICS_VIEW,
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.DASHBOARD_ADMIN,
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },

  CUSTOMER_SUPPORT: {
    id: 'role-customer-support',
    name: 'Customer Support',
    slug: 'customer-support',
    description: 'View orders, manage users, moderate reviews',
    permissions: [
      PERMISSIONS.ORDER_VIEW,
      PERMISSIONS.ORDER_UPDATE,
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.REVIEW_VIEW,
      PERMISSIONS.REVIEW_MODERATE,
      PERMISSIONS.PRODUCT_READ,
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.DASHBOARD_ADMIN,
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },

  INVENTORY_MANAGER: {
    id: 'role-inventory-manager',
    name: 'Inventory Manager',
    slug: 'inventory-manager',
    description: 'Manage inventory levels and view products/orders',
    permissions: [
      ...PERMISSION_GROUPS.inventory,
      PERMISSIONS.PRODUCT_READ,
      PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.ORDER_VIEW,
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.DASHBOARD_ADMIN,
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },

  CONTENT_MANAGER: {
    id: 'role-content-manager',
    name: 'Content Manager',
    slug: 'content-manager',
    description: 'Manage pages, blogs, FAQs, policies, media, and SEO',
    permissions: [
      ...PERMISSION_GROUPS.cms,
      ...PERMISSION_GROUPS.content,
      ...PERMISSION_GROUPS.media,
      PERMISSIONS.SETTINGS_SEO,
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.DASHBOARD_ADMIN,
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },

  FINANCE_MANAGER: {
    id: 'role-finance-manager',
    name: 'Finance Manager',
    slug: 'finance-manager',
    description: 'View orders, manage refunds, analytics, taxes, and payment settings',
    permissions: [
      PERMISSIONS.ORDER_VIEW,
      PERMISSIONS.ORDER_REFUND,
      PERMISSIONS.ORDER_EXPORT,
      ...PERMISSION_GROUPS.analytics,
      PERMISSIONS.SETTINGS_PAYMENT,
      PERMISSIONS.SETTINGS_TAX,
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.DASHBOARD_ADMIN,
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },

  CUSTOMER: {
    id: 'role-customer',
    name: 'Customer',
    slug: 'customer',
    description: 'Storefront access only — no admin panel',
    permissions: [],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
};

export const DEFAULT_ROLES = Object.values(ROLES);

export function getRoleById(id: string): Role | undefined {
  return DEFAULT_ROLES.find(r => r.id === id);
}

export function getRoleBySlug(slug: string): Role | undefined {
  return DEFAULT_ROLES.find(r => r.slug === slug);
}
