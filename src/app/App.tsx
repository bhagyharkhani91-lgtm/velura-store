import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from '../components/ui/Toast/Toast';
import { router } from './router';
import { SplashScreen } from '../components/ui/SplashScreen/SplashScreen';
import { AgeGate } from '../components/ui/AgeGate/AgeGate';
import { useAuthStore } from '../stores/authStore';
import { useOrdersStore } from '../stores/ordersStore';
import { useProductStore } from '../stores/productStore';
import { useSettingsStore } from '../stores/settingsStore';

const ADMIN_ROLES = ['admin', 'super_admin', 'manager'];

export function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAgeVerified, setIsAgeVerified] = useState(true);
  const initializeAuth = useAuthStore(state => state.initialize);
  const fetchOrders = useOrdersStore(state => state.fetchOrders);
  const fetchProducts = useProductStore(state => state.fetchProducts);
  const fetchSettings = useSettingsStore(state => state.fetchSettings);

  useEffect(() => {
    initializeAuth().then(() => {
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        const isAdmin = ADMIN_ROLES.includes(currentUser.role);
        fetchOrders(isAdmin ? undefined : currentUser.id);
      }
    });

    fetchProducts();
    fetchSettings();

    const hasSeenSplash = sessionStorage.getItem('personalCare_splash_shown');
    if (hasSeenSplash) {
      setShowSplash(false);
    }

    const hasVerifiedAge = localStorage.getItem('personalCare_age_verified');
    if (!hasVerifiedAge) {
      setIsAgeVerified(false);
    }
  }, [initializeAuth, fetchOrders, fetchProducts, fetchSettings]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('personalCare_splash_shown', 'true');
  };

  const handleAgeVerify = () => {
    setIsAgeVerified(true);
    localStorage.setItem('personalCare_age_verified', 'true');
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {!showSplash && !isAgeVerified && <AgeGate onVerify={handleAgeVerify} />}
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}
