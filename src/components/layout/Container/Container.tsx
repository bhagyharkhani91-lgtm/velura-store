import type { ReactNode } from 'react';
import { cn } from '../../../utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
}

export function Container({ children, className, style, as: Component = 'div' }: ContainerProps) {
  return (
    <Component className={cn('container', className)} style={style}>
      {children}
    </Component>
  );
}
