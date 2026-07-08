import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Drawer } from '../../ui/Drawer/Drawer';
import { useUIStore } from '../../../stores/uiStore';
import { useAuthStore } from '../../../stores/authStore';
import { Home, Package, Tags, Info, Phone, LogIn, LogOut, User as UserIcon, ShoppingBag, ShieldCheck } from 'lucide-react';
import './MobileMenu.css';

export function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate('/');
  };

  return (
    <Drawer
      isOpen={isMobileMenuOpen}
      onClose={closeMobileMenu}
      title="Menu"
      side="left"
      size="sm"
    >
      <div className="mobile-menu-content flex flex-col h-full">
        <nav className="mobile-nav-links flex-1">
          <ul className="space-y-1 py-4">
            <li>
              <NavLink to="/" className="mobile-nav-item" onClick={closeMobileMenu}>
                <Home size={20} />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className="mobile-nav-item" onClick={closeMobileMenu}>
                <Package size={20} />
                <span>All Products</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/categories" className="mobile-nav-item" onClick={closeMobileMenu}>
                <Tags size={20} />
                <span>Categories</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="mobile-nav-item" onClick={closeMobileMenu}>
                <Info size={20} />
                <span>About Us</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="mobile-nav-item" onClick={closeMobileMenu}>
                <Phone size={20} />
                <span>Contact</span>
              </NavLink>
            </li>
          </ul>

          <div className="border-t border-border my-2 mx-4" />

          <ul className="space-y-1 py-4">
            {isAuthenticated ? (
              <>
                <li>
                  <div className="px-4 py-2 mb-2">
                    <p className="text-xs text-secondary uppercase font-bold tracking-wider">Account</p>
                    <p className="font-medium text-primary mt-1">{user?.name}</p>
                    <p className="text-xs text-tertiary">{user?.email}</p>
                  </div>
                </li>
                <li>
                  <Link to="/profile" className="mobile-nav-item" onClick={closeMobileMenu}>
                    <UserIcon size={20} />
                    <span>My Profile</span>
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="mobile-nav-item" onClick={closeMobileMenu}>
                    <ShoppingBag size={20} />
                    <span>My Orders</span>
                  </Link>
                </li>
                {user?.role === 'admin' && (
                  <li>
                    <Link to="/admin" className="mobile-nav-item text-accent" onClick={closeMobileMenu}>
                      <ShieldCheck size={20} />
                      <span>Admin Panel</span>
                    </Link>
                  </li>
                )}
                <li>
                  <button onClick={handleLogout} className="mobile-nav-item text-error w-full text-left">
                    <LogOut size={20} />
                    <span>Log Out</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <div className="px-4 py-2 mb-2">
                    <p className="text-xs text-secondary uppercase font-bold tracking-wider">Account</p>
                  </div>
                </li>
                <li>
                  <Link to="/login" className="mobile-nav-item" onClick={closeMobileMenu}>
                    <LogIn size={20} />
                    <span>Log In</span>
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="mobile-nav-item" onClick={closeMobileMenu}>
                    <UserIcon size={20} />
                    <span>Sign Up</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </Drawer>
  );
}
