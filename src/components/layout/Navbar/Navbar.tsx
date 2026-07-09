import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, Tag } from 'lucide-react';
import { Container } from '../Container/Container';
import { useUIStore } from '../../../stores/uiStore';
import { useCartStore } from '../../../stores/cartStore';
import { useAuthStore } from '../../../stores/authStore';
import { useCategoryStore } from '../../../stores/categoryStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import './Navbar.css';

export function Navbar() {
  const { toggleMobileMenu } = useUIStore();
  const { openCart, getItemCount } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartCount = getItemCount();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Check if we are on an auth page to show a simplified header
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const { categories } = useCategoryStore();

  const { promoMessages } = useSettingsStore();

  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  useEffect(() => {
    if (!promoMessages || promoMessages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentPromoIndex(prev => (prev + 1) % promoMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [promoMessages]);

  // Filter out top-men and top-women categories
  const filteredCats = categories.filter(c => c.slug !== 'top-men' && c.slug !== 'top-women');
  
  // Find "Fresh Picks" category and place it right after "Home"
  const freshPicks = filteredCats.find(c => c.slug === 'fresh-picks');
  const otherCats = filteredCats.filter(c => c.slug !== 'fresh-picks');

  const navCategories = [
    { name: 'Home', path: '/', highlight: false },
    { name: 'All', path: '/products', highlight: false },
    ...(freshPicks
      ? [{
          name: freshPicks.name,
          path: `/categories/${freshPicks.slug}`,
          highlight: true
        }]
      : []),
    ...otherCats.map(c => ({
      name: c.name,
      path: `/categories/${c.slug}`,
      highlight: false
    }))
  ];

  return (
    <>
      {/* Top Promo Bar - Hidden on Auth Pages */}
      {!isAuthPage && promoMessages.length > 0 && (
        <div className="promo-bar hide-mobile">
          <div className="promo-bar-content">
            <div className="promo-carousel-content" key={currentPromoIndex}>
              <span className="promo-item" style={{ fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                <Tag size={16} /> {promoMessages[currentPromoIndex]}
              </span>
            </div>
          </div>
        </div>
      )}

      <header className="navbar-wrapper">
        {/* Main Navbar */}
        <nav className={`navbar main-navbar ${isAuthPage ? 'py-6' : ''}`}>
          <Container className="navbar-container">
            {/* Mobile Menu Button */}
            {!isAuthPage && (
              <button className="navbar-icon-btn hide-desktop" onClick={toggleMobileMenu}>
                <Menu size={24} />
              </button>
            )}

            {/* Logo */}
            <Link to="/" className="navbar-logo" style={isAuthPage ? { margin: '0 auto' } : {}}>
              VELURA
            </Link>

            {/* Search Bar - Hidden on Auth Pages */}
            {!isAuthPage && (
              <form 
                className="navbar-search hide-mobile" 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                  } else {
                    navigate('/');
                  }
                }}
              >
                <input 
                  type="text" 
                  placeholder="Search for products, brands and more..." 
                  className="navbar-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="navbar-search-btn">
                  Search
                </button>
              </form>
            )}

            {/* Actions - Hidden on Auth Pages */}
            {!isAuthPage && (
              <div className="navbar-actions">
                <button className="navbar-icon-btn navbar-cart-btn" onClick={openCart} aria-label="Cart">
                  <ShoppingBag size={28} />
                  <span className="cart-badge">{cartCount}</span>
                </button>
                
                {isAuthenticated ? (
                  <div 
                    className="navbar-user-section hide-mobile" 
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setIsUserDropdownOpen(true)}
                    onMouseLeave={() => setIsUserDropdownOpen(false)}
                  >
                    <button 
                      className="navbar-user-greeting" 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 0' }}
                    >
                      Hi, {user?.name?.split(' ')[0]}
                    </button>
                    
                    {isUserDropdownOpen && (
                      <div className="navbar-user-dropdown">
                        <div className="navbar-dropdown-header">
                          <p className="navbar-dropdown-name">{user?.name}</p>
                          <p className="navbar-dropdown-email">{user?.email}</p>
                        </div>
                        <div className="navbar-dropdown-divider" />
                        <ul className="navbar-dropdown-list">
                          <li>
                            <Link to="/profile" className="navbar-dropdown-item">My Profile</Link>
                          </li>
                          <li>
                            <Link to="/orders" className="navbar-dropdown-item">My Orders</Link>
                          </li>
                          {user?.role === 'admin' && (
                            <li>
                              <Link to="/admin" className="navbar-dropdown-item admin-link">Admin Panel</Link>
                            </li>
                          )}
                        </ul>
                        <div className="navbar-dropdown-divider" />
                        <button onClick={logout} className="navbar-dropdown-item logout-btn">
                          Log out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login" className="navbar-login-link hide-mobile">
                    Log In/Sign Up
                  </Link>
                )}
              </div>
            )}
          </Container>
        </nav>

        {/* Category Navbar - Hidden on Auth Pages */}
        {!isAuthPage && (
          <nav className="category-navbar hide-mobile">
            <Container>
              <ul className="category-list">
                {navCategories.map((category) => (
                  <li key={category.name}>
                    <NavLink 
                      to={category.path} 
                      end={category.path === '/'}
                      className={({ isActive }) => 
                        `category-link ${isActive ? 'active' : ''} ${category.highlight ? 'category-highlight' : ''}`
                      }
                    >
                      {category.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </Container>
          </nav>
        )}
      </header>
    </>
  );
}
