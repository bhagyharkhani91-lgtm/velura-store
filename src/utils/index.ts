// ============================================
// Utility Functions
// ============================================

// ---- Formatters ----

export function formatPrice(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(new Date(date));
}

export function formatRelativeTime(date: string): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date, { month: 'short', day: 'numeric' });
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// ---- Helpers ----

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getDiscountPercentage(price: number, compareAtPrice: number): number {
  if (compareAtPrice <= 0) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

// ---- Validators ----

const ALLOWED_EMAIL_DOMAINS = ['gmail.com', 'outlook.com'];

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isAllowedEmailDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? ALLOWED_EMAIL_DOMAINS.includes(domain) : false;
}

export function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s-()]{10,}$/.test(phone);
}

export function isValidZipCode(zip: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(zip);
}

export async function uploadToCloudinary(file: File): Promise<{ url: string; publicId: string }> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { error?: { message?: string } }).error?.message || 'Image upload failed');
  }

  const data = await response.json() as { secure_url: string; public_id: string };
  return { url: data.secure_url, publicId: data.public_id };
}

export function validateImageUpload(file: File): { isValid: boolean; error?: string } {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  if (!VALID_TYPES.includes(file.type)) {
    return { isValid: false, error: `Invalid file type. Only JPG, PNG, and WEBP are allowed.` };
  }

  if (file.size > MAX_SIZE) {
    return { isValid: false, error: `File too large (${formatFileSize(file.size)}). Maximum allowed size is 5MB.` };
  }

  return { isValid: true };
}
