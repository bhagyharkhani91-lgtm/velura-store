import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { useSettingsStore } from '../../../stores/settingsStore';
import { useProductStore } from '../../../stores/productStore';
import './RecentPurchasePopup.css';

const APPEAR_DELAY_MS = 1500;
const REAPPEAR_DELAY_MS = 7000;
const ROTATE_INTERVAL_MS = 5000;
const FADE_DURATION_MS = 400;

export function RecentPurchasePopup() {
  const { purchaseNotifications } = useSettingsStore();
  const { products } = useProductStore();
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const initialTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const reappearTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const rotateIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const activeItems = purchaseNotifications
    .filter((n) => n.isActive && n.message)
    .map((n) => ({
      notification: n,
      product: products.find((p) => p.id === n.productId)
    }))
    .filter((item) => item.product);

  const current = activeItems[currentIndex];
  const hasItems = activeItems.length > 0;

  // Cleanup all timers helper
  const clearTimers = () => {
    clearTimeout(initialTimerRef.current);
    clearTimeout(reappearTimerRef.current);
    clearInterval(rotateIntervalRef.current);
    clearTimeout(advanceTimerRef.current);
  };

  // Initial appearance delay
  useEffect(() => {
    if (!hasItems) {
      setVisible(false);
      return;
    }

    clearTimers();
    initialTimerRef.current = setTimeout(() => setVisible(true), APPEAR_DELAY_MS);
    return () => {
      clearTimeout(initialTimerRef.current);
      clearTimeout(reappearTimerRef.current);
    };
  }, [hasItems]);

  // Keep currentIndex in bounds when list shrinks
  useEffect(() => {
    if (activeItems.length === 0) {
      setCurrentIndex(0);
      return;
    }
    if (currentIndex >= activeItems.length) {
      setCurrentIndex(0);
    }
  }, [activeItems.length, currentIndex]);

  // Rotation timer: fade out → advance → fade in
  useEffect(() => {
    if (!visible || activeItems.length <= 1) return;

    clearInterval(rotateIntervalRef.current);
    clearTimeout(advanceTimerRef.current);

    rotateIntervalRef.current = setInterval(() => {
      setVisible(false);
      advanceTimerRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activeItems.length);
        setVisible(true);
      }, FADE_DURATION_MS);
    }, ROTATE_INTERVAL_MS);

    return () => {
      clearInterval(rotateIntervalRef.current);
      clearTimeout(advanceTimerRef.current);
    };
  }, [visible, activeItems.length]);

  const handleClose = () => {
    setVisible(false);
    clearInterval(rotateIntervalRef.current);
    clearTimeout(advanceTimerRef.current);
    clearTimeout(initialTimerRef.current);
    clearTimeout(reappearTimerRef.current);
    reappearTimerRef.current = setTimeout(() => {
      setVisible(true);
    }, REAPPEAR_DELAY_MS);
  };

  // Full cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, []);

  if (!hasItems) {
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