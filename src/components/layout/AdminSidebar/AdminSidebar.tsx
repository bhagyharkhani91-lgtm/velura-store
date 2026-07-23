import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  Settings,
  X,
  ExternalLink,
  MessageSquare,
  Inbox,
  Truck
} from 'lucide-react';
import './AdminSidebar.css';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/products', icon: Package, label: 'Products' },
  { path: '/admin/pages', icon: Tags, label: 'Pages' },
  { path: '/admin/categories', icon: Tags, label: 'Categories' },
  { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/reviews', icon: MessageSquare, label: 'Reviews' },
  { path: '/admin/messages', icon: Inbox, label: 'Messages' },
  { path: '/admin/delivery', icon: Truck, label: 'Delivery' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const location = useLocation();

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="admin-sidebar-header">
        <Link to="/" className="admin-sidebar-logo">
          PERSONAL CARE
        </Link>
        <button className="admin-sidebar-close hide-desktop" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <nav className="admin-sidebar-nav">
        <ul className="admin-nav-list">
          {navItems.map((item) => (
            <li key={item.path} className="admin-nav-item">
              <Link 
                to={item.path} 
                className={`admin-nav-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
                onClick={() => {
                  if (window.innerWidth <= 768) onClose();
                }}
              >
                <item.icon size={20} className="admin-nav-icon" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-divider" />
        
        <ul className="admin-nav-list">
          <li className="admin-nav-item">
            <Link to="/" className="admin-nav-link text-muted">
              <ExternalLink size={20} className="admin-nav-icon" />
              <span>Storefront</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
