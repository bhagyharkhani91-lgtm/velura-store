import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useSettingsStore } from '../../../stores/settingsStore';
import { useProductStore } from '../../../stores/productStore';
import './RecentPurchasePopup.css';

const DISMISS_KEY = 'recent_purchase_dismissed_at';
const RESHOW_DELAY_MS = 6 * 60 * 60 * 1000;
const APPEAR_DELAY_MS = 1500;

export function RecentPurchasePopup() {
  const { purchaseNotification } = useSettingsStore();
  const { products } = useProductStore();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const notification = purchaseNotification;
  const product = notification?.productId
    ? products.find((p) => p.id === notification.productId)
    : undefined;

  const isReady = !!(notification?.isActive && notification?.message && product);

  useEffect(() => {
    if (!isReady) {
      setVisible(false);
      return;
    }

    try {
      const last = Number(localStorage.getItem(DISMISS_KEY) || 0);
      if (last && Date.now() - last < RESHOW_DELAY_MS) {
        return;
      }
    } catch {
      // ignore storage errors
    }

    const t = setTimeout(() => setVisible(true), APPEAR_DELAY_MS);
    return () => clearTimeout(t);
  }, [isReady, notification?.productId, notification?.message]);

  const handleClose = () => {
    setVisible(false);
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  };

  if (!isReady || dismissed) {
    return null;
  }

  const primaryImage = product?.images?.find((img) => img.isPrimary) || product?.images?.[0];

  return (
    <div
      className={`recent-purchase-popup ${visible ? 'visible' : ''}`}
      role="status"
      aria-live="polite"
    >
      <button
        type="button"
        className="recent-purchase-popup__close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
      {primaryImage ? (
        <img
          src={primaryImage.url}
          alt={primaryImage.alt || product?.name || 'Product'}
          className="recent-purchase-popup__image"
        />
      ) : (
        <div className="recent-purchase-popup__image" />
      )}
      <div className="recent-purchase-popup__body">
        <span className="recent-purchase-popup__name">{product?.name}</span>
        <span className="recent-purchase-popup__message">{notification?.message}</span>
      </div>
    </div>
  );
}