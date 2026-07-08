// ============================================
// RBAC — usePermissions Hook
// ============================================

import { useAuthStore } from './AuthProvider';
import type { Permission } from './permissions';

export function usePermissions() {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);
  const hasAllPermissions = useAuthStore((s) => s.hasAllPermissions);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const role = useAuthStore((s) => s.role);
  const user = useAuthStore((s) => s.user);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin: isAdmin(),
    role,
    user,
  };
}

export function useCanAccess(permission: Permission): boolean {
  return useAuthStore((s) => s.hasPermission)(permission);
}
