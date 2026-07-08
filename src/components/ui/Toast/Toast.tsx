import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useUIStore } from '../../../stores/uiStore';
import { cn } from '../../../utils';
import './Toast.css';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="toast-container" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        return (
          <div key={toast.id} className={cn('toast', `toast--${toast.type}`)} role="alert">
            <Icon size={20} className="toast-icon" />
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              {toast.message && <div className="toast-message">{toast.message}</div>}
            </div>
            <button className="toast-close" onClick={() => removeToast(toast.id)} aria-label="Dismiss">
              <X size={14} />
            </button>
            <div
              className="toast-progress"
              style={{ animation: `progressShrink ${toast.duration || 5000}ms linear forwards` }}
            />
          </div>
        );
      })}
    </div>,
    document.body
  );
}
