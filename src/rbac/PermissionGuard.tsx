// ============================================
// RBAC — Permission Guard Component
// ============================================

import type { ReactNode } from 'react';
import { useAuthStore } from './AuthProvider';
import type { Permission } from './permissions';

interface CanProps {
  /** Single permission to check */
  permission?: Permission;
  /** Multiple permissions — user must have ANY */
  anyOf?: Permission[];
  /** Multiple permissions — user must have ALL */
  allOf?: Permission[];
  /** Content to render when user has access */
  children: ReactNode;
  /** Optional fallback when user lacks access */
  fallback?: ReactNode;
}

export function Can({ permission, anyOf, allOf, children, fallback = null }: CanProps) {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);
  const hasAllPermissions = useAuthStore((s) => s.hasAllPermissions);

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (anyOf) {
    hasAccess = hasAnyPermission(anyOf);
  } else if (allOf) {
    hasAccess = hasAllPermissions(allOf);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
