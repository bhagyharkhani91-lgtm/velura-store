// ============================================
// RBAC — Auth Store (Zustand)
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/user';
import type { Role } from './roles';
import { ROLES, getRoleById } from './roles';
import type { Permission } from './permissions';

interface AuthState {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;

  // Actions
  login: (user: User) => void;
  logout: () => void;
  switchRole: (roleId: string) => void;

  // Permission checks
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      isAuthenticated: false,

      login: (user: User) => {
        const role = getRoleById(user.roleId) ?? ROLES.CUSTOMER;
        set({ user, role, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, role: null, isAuthenticated: false });
      },

      switchRole: (roleId: string) => {
        const role = getRoleById(roleId);
        if (role) {
          set((state) => ({
            role,
            user: state.user ? { ...state.user, roleId } : null,
          }));
        }
      },

      hasPermission: (permission: Permission) => {
        const { role } = get();
        if (!role) return false;
        return role.permissions.includes(permission);
      },

      hasAnyPermission: (permissions: Permission[]) => {
        const { role } = get();
        if (!role) return false;
        return permissions.some(p => role.permissions.includes(p));
      },

      hasAllPermissions: (permissions: Permission[]) => {
        const { role } = get();
        if (!role) return false;
        return permissions.every(p => role.permissions.includes(p));
      },

      isAdmin: () => {
        const { role } = get();
        if (!role) return false;
        return role.permissions.length > 0; // Any role with permissions is admin-level
      },
    }),
    {
      name: 'velura-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
