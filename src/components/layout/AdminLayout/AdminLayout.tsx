import { Outlet, Link } from 'react-router-dom';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { AdminSidebar } from '../AdminSidebar/AdminSidebar';
import { useAuthStore } from '../../../stores/authStore';
import { Button } from '../../ui/Button/Button';
import './AdminLayout.css';
import { useState } from 'react';

export function AdminLayout() {
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <button className="admin-menu-btn hide-desktop" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h1 className="admin-header-title">
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="brand-name">ADULT STORE</span>
              </Link>
              <span className="admin-badge">ADMIN</span>
            </h1>
          </div>
          
          <div className="admin-header-right">
            <button className="admin-icon-btn" aria-label="Notifications">
              <Bell size={20} />
            </button>
            
            <div className="admin-user-profile">
              <div className="admin-avatar">
                <User size={20} />
              </div>
              <div className="admin-user-info hide-mobile">
                <span className="admin-user-name">{user?.name || 'Admin User'}</span>
                <span className="admin-user-role">{user?.role}</span>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              title="Logout"
              className="admin-logout-btn"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay hide-desktop" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
