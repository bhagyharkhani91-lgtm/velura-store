import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useScrollLock, useKeyboard } from '../../../hooks';
import { cn } from '../../../utils';
import './Drawer.css';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: ReactNode;
  footer?: ReactNode;
  showClose?: boolean;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  side = 'right',
  size = 'md',
  children,
  footer,
  showClose = true,
}: DrawerProps) {
  useScrollLock(isOpen);
  useKeyboard('Escape', onClose, isOpen);

  if (!isOpen) return null;

  return createPortal(
    <div className="drawer-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={cn('drawer', `drawer--${side}`, `drawer--${size}`)}>
        {(title || showClose) && (
          <div className="drawer-header">
            {title && <h2 className="drawer-title">{title}</h2>}
            {showClose && (
              <button className="drawer-close" onClick={onClose} aria-label="Close drawer">
                <X size={20} />
              </button>
            )}
          </div>
        )}
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
