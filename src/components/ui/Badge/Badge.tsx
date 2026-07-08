import type { ReactNode } from 'react';
import { cn } from '../../../utils';
import './Badge.css';

interface BadgeProps {
  variant?: 'default' | 'accent' | 'success' | 'error' | 'warning' | 'info' | 'gold' | 'new' | 'sale';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', size = 'md', dot, children, className }: BadgeProps) {
  return (
    <span className={cn('badge', `badge--${variant}`, `badge--${size}`, className)}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}
