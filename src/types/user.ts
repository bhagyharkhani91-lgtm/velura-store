// ============================================
// User Types
// ============================================

export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface UserPreferences {
  newsletter: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  darkMode: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  addresses: Address[];
  preferences: UserPreferences;
  roleId: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string;
}
