import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from '../components/ui/Toast/Toast';
import { router } from './router';
import { SplashScreen } from '../components/ui/SplashScreen/SplashScreen';
import { useAuthStore } from '../stores/authStore';
import { useOrdersStore } from '../stores/ordersStore';
import { useProductStore } from '../stores/productStore';
import { useSettingsStore } from '../stores/settingsStore';

export function App() {
  const [showSplash, setShowSplash] = useState(true);
  const initializeAuth = useAuthStore(state => state.initialize);
  const fetchOrders = useOrdersStore(state => state.fetchOrders);
  const fetchProducts = useProductStore(state => state.fetchProducts);
  const fetchSettings = useSettingsStore(state => state.fetchSettings);

  useEffect(() => {
    initializeAuth().then(() => {
      // After auth is initialized, fetch all orders relevant to the user
      fetchOrders();
    });
    
    // Fetch public products and settings on mount
    fetchProducts();
    fetchSettings();
    
    const hasSeenSplash = sessionStorage.getItem('velura_splash_shown');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, [initializeAuth, fetchOrders, fetchProducts, fetchSettings]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('velura_splash_shown', 'true');
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}
