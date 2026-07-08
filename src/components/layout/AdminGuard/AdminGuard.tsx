import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';

export function AdminGuard() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!isAuthenticated) {
    // Redirect to login but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    // Authenticated but not an admin -> redirect to home
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is an admin -> render child routes
  return <Outlet />;
}
