import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useSettingsStore } from '../../../stores/settingsStore';
import { useProductStore } from '../../../stores/productStore';
import './RecentPurchasePopup.css';

const DISMISS_KEY = 'recent_purchase_dismissed_at';
const RESHOW_DELAY_MS = 6 * 60 * 60 * 1000;
const APPEAR_DELAY_MS = 1500;
const ROTATE_INTERVAL_MS = 5000;
const FADE_DURATION_MS = 400;

export function RecentPurchasePopup() {
  const { purchaseNotifications } = useSettingsStore();
  const { products } = useProductStore();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Resolve active notifications with valid products (memo of render cycle).
  const activeItems = purchaseNotifications
    .filter((n) => n.isActive && n.message)
    .map((n) => ({
      notification: n,
      product: products.find((p) => p.id === n.productId)
    }))
    .filter((item) => item.product);

  const current = activeItems[currentIndex];
  const hasItems = activeItems.length > 0;

  // First appearance + dismiss/reshow logic.
  useEffect(() => {
    if (!hasItems) {
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
  }, [hasItems]);

  // Keep currentIndex in bounds when list shrinks.
  useEffect(() => {
    if (activeItems.length === 0) {
      setCurrentIndex(0);
      return;
    }
    if (currentIndex >= activeItems.length) {
      setCurrentIndex(0);
    }
  }, [activeItems.length, currentIndex]);

  // Rotation timer: fade out → advance → fade in.
  useEffect(() => {
    if (!visible || activeItems.length <= 1) return;

    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activeItems.length);
        setVisible(true);
      }, FADE_DURATION_MS);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(t);
  }, [visible, activeItems.length]);

  const handleClose = () => {
    setVisible(false);
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  };

  if (!hasItems || dismissed) {
    return null;
  }

  const product = current?.product;
  const notification = current?.notification;
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