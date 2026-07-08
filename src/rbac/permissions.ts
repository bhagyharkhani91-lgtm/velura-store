// ============================================
// RBAC — Permission Constants
// ============================================

export const PERMISSIONS = {
  // Products
  PRODUCT_CREATE: 'product.create',
  PRODUCT_READ: 'product.read',
  PRODUCT_UPDATE: 'product.update',
  PRODUCT_DELETE: 'product.delete',
  PRODUCT_PUBLISH: 'product.publish',
  PRODUCT_BULK: 'product.bulk',

  // Categories
  CATEGORY_CREATE: 'category.create',
  CATEGORY_READ: 'category.read',
  CATEGORY_UPDATE: 'category.update',
  CATEGORY_DELETE: 'category.delete',

  // Orders
  ORDER_VIEW: 'order.view',
  ORDER_UPDATE: 'order.update',
  ORDER_REFUND: 'order.refund',
  ORDER_CANCEL: 'order.cancel',
  ORDER_EXPORT: 'order.export',

  // Inventory
  INVENTORY_VIEW: 'inventory.view',
  INVENTORY_UPDATE: 'inventory.update',
  INVENTORY_ALERTS: 'inventory.alerts',

  // Campaigns & Marketing
  CAMPAIGN_CREATE: 'campaign.create',
  CAMPAIGN_READ: 'campaign.read',
  CAMPAIGN_UPDATE: 'campaign.update',
  CAMPAIGN_DELETE: 'campaign.delete',
  CAMPAIGN_PUBLISH: 'campaign.publish',
  COUPON_CREATE: 'coupon.create',
  COUPON_READ: 'coupon.read',
  COUPON_UPDATE: 'coupon.update',
  COUPON_DELETE: 'coupon.delete',
  BANNER_MANAGE: 'banner.manage',

  // CMS / Pages
  PAGE_CREATE: 'page.create',
  PAGE_READ: 'page.read',
  PAGE_UPDATE: 'page.update',
  PAGE_DELETE: 'page.delete',
  PAGE_PUBLISH: 'page.publish',
  PAGE_SCHEDULE: 'page.schedule',

  // Homepage
  HOMEPAGE_MANAGE: 'homepage.manage',
  HOMEPAGE_SECTIONS: 'homepage.sections',
  HOMEPAGE_BANNERS: 'homepage.banners',

  // Content (Blog, FAQ, Policies)
  CONTENT_CREATE: 'content.create',
  CONTENT_READ: 'content.read',
  CONTENT_UPDATE: 'content.update',
  CONTENT_DELETE: 'content.delete',
  CONTENT_PUBLISH: 'content.publish',

  // Media Library
  MEDIA_UPLOAD: 'media.upload',
  MEDIA_READ: 'media.read',
  MEDIA_DELETE: 'media.delete',
  MEDIA_ORGANIZE: 'media.organize',

  // Reviews
  REVIEW_VIEW: 'review.view',
  REVIEW_MODERATE: 'review.moderate',
  REVIEW_DELETE: 'review.delete',

  // Users
  USER_CREATE: 'user.create',
  USER_READ: 'user.read',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  USER_SUSPEND: 'user.suspend',

  // Roles & Permissions
  ROLE_CREATE: 'role.create',
  ROLE_READ: 'role.read',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',
  ROLE_ASSIGN: 'role.assign',
  PERMISSION_MANAGE: 'permission.manage',

  // Settings
  SETTINGS_GENERAL: 'settings.general',
  SETTINGS_PAYMENT: 'settings.payment',
  SETTINGS_SHIPPING: 'settings.shipping',
  SETTINGS_TAX: 'settings.tax',
  SETTINGS_NOTIFICATION: 'settings.notification',
  SETTINGS_SEO: 'settings.seo',
  SETTINGS_INTEGRATION: 'settings.integration',
  SETTINGS_SECURITY: 'settings.security',

  // Analytics
  ANALYTICS_VIEW: 'analytics.view',
  ANALYTICS_EXPORT: 'analytics.export',
  ANALYTICS_REVENUE: 'analytics.revenue',

  // Audit Logs
  AUDIT_VIEW: 'audit.view',
  SYSTEM_LOGS: 'system.logs',

  // API & Integrations
  API_KEYS: 'api.keys',
  INTEGRATION_MANAGE: 'integration.manage',

  // Feature Flags
  FEATURE_FLAGS: 'feature.flags',

  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',
  DASHBOARD_ADMIN: 'dashboard.admin',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);

// Permission groups for easier assignment
export const PERMISSION_GROUPS = {
  products: [
    PERMISSIONS.PRODUCT_CREATE, PERMISSIONS.PRODUCT_READ, 
    PERMISSIONS.PRODUCT_UPDATE, PERMISSIONS.PRODUCT_DELETE,
    PERMISSIONS.PRODUCT_PUBLISH, PERMISSIONS.PRODUCT_BULK,
  ],
  categories: [
    PERMISSIONS.CATEGORY_CREATE, PERMISSIONS.CATEGORY_READ,
    PERMISSIONS.CATEGORY_UPDATE, PERMISSIONS.CATEGORY_DELETE,
  ],
  orders: [
    PERMISSIONS.ORDER_VIEW, PERMISSIONS.ORDER_UPDATE,
    PERMISSIONS.ORDER_REFUND, PERMISSIONS.ORDER_CANCEL, PERMISSIONS.ORDER_EXPORT,
  ],
  inventory: [
    PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_UPDATE, PERMISSIONS.INVENTORY_ALERTS,
  ],
  marketing: [
    PERMISSIONS.CAMPAIGN_CREATE, PERMISSIONS.CAMPAIGN_READ, PERMISSIONS.CAMPAIGN_UPDATE,
    PERMISSIONS.CAMPAIGN_DELETE, PERMISSIONS.CAMPAIGN_PUBLISH,
    PERMISSIONS.COUPON_CREATE, PERMISSIONS.COUPON_READ, PERMISSIONS.COUPON_UPDATE, PERMISSIONS.COUPON_DELETE,
    PERMISSIONS.BANNER_MANAGE,
  ],
  cms: [
    PERMISSIONS.PAGE_CREATE, PERMISSIONS.PAGE_READ, PERMISSIONS.PAGE_UPDATE,
    PERMISSIONS.PAGE_DELETE, PERMISSIONS.PAGE_PUBLISH, PERMISSIONS.PAGE_SCHEDULE,
  ],
  homepage: [
    PERMISSIONS.HOMEPAGE_MANAGE, PERMISSIONS.HOMEPAGE_SECTIONS, PERMISSIONS.HOMEPAGE_BANNERS,
  ],
  content: [
    PERMISSIONS.CONTENT_CREATE, PERMISSIONS.CONTENT_READ, PERMISSIONS.CONTENT_UPDATE,
    PERMISSIONS.CONTENT_DELETE, PERMISSIONS.CONTENT_PUBLISH,
  ],
  media: [
    PERMISSIONS.MEDIA_UPLOAD, PERMISSIONS.MEDIA_READ, PERMISSIONS.MEDIA_DELETE, PERMISSIONS.MEDIA_ORGANIZE,
  ],
  reviews: [
    PERMISSIONS.REVIEW_VIEW, PERMISSIONS.REVIEW_MODERATE, PERMISSIONS.REVIEW_DELETE,
  ],
  users: [
    PERMISSIONS.USER_CREATE, PERMISSIONS.USER_READ, PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE, PERMISSIONS.USER_SUSPEND,
  ],
  roles: [
    PERMISSIONS.ROLE_CREATE, PERMISSIONS.ROLE_READ, PERMISSIONS.ROLE_UPDATE,
    PERMISSIONS.ROLE_DELETE, PERMISSIONS.ROLE_ASSIGN, PERMISSIONS.PERMISSION_MANAGE,
  ],
  settings: [
    PERMISSIONS.SETTINGS_GENERAL, PERMISSIONS.SETTINGS_PAYMENT, PERMISSIONS.SETTINGS_SHIPPING,
    PERMISSIONS.SETTINGS_TAX, PERMISSIONS.SETTINGS_NOTIFICATION, PERMISSIONS.SETTINGS_SEO,
    PERMISSIONS.SETTINGS_INTEGRATION, PERMISSIONS.SETTINGS_SECURITY,
  ],
  analytics: [
    PERMISSIONS.ANALYTICS_VIEW, PERMISSIONS.ANALYTICS_EXPORT, PERMISSIONS.ANALYTICS_REVENUE,
  ],
  system: [
    PERMISSIONS.AUDIT_VIEW, PERMISSIONS.SYSTEM_LOGS, PERMISSIONS.API_KEYS,
    PERMISSIONS.INTEGRATION_MANAGE, PERMISSIONS.FEATURE_FLAGS,
  ],
} as const;
