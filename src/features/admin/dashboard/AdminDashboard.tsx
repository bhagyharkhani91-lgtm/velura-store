import { useState } from 'react';
import { ShoppingCart, Users, DollarSign, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrdersStore } from '../../../stores/ordersStore';
import { useProductStore } from '../../../stores/productStore';
import { formatPrice } from '../../../utils';
import { RecentSalesChart } from './RecentSalesChart';
import { Modal } from '../../../components/ui/Modal/Modal';

export function AdminDashboard() {
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const { orders, getTotalRevenue, getTotalOrdersCount } = useOrdersStore();
  const { products } = useProductStore();
  const navigate = useNavigate();
  
  const revenue = getTotalRevenue();
  const orderCount = getTotalOrdersCount();
  const recentOrders = orders.slice(0, 5); // Get the 5 most recent orders
  
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.stockCount <= 10).length;

  return (
    <div>
      <h1 className="heading-3xl mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-secondary font-medium">Total Revenue</h3>
            <div className="w-10 h-10 rounded-full bg-accent-subtle flex items-center justify-center text-accent">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">{formatPrice(revenue)}</p>
          <p className="text-success text-sm mt-2">All time</p>
        </div>

        <div className="bg-surface rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-secondary font-medium">Orders</h3>
            <div className="w-10 h-10 rounded-full bg-info-muted flex items-center justify-center text-info">
              <ShoppingCart size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">{orderCount}</p>
          <p className="text-success text-sm mt-2">All time</p>
        </div>

        <div className="bg-surface rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-secondary font-medium">Customers</h3>
            <div className="w-10 h-10 rounded-full bg-warning-muted flex items-center justify-center text-warning">
              <Users size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">2,405</p>
          <p className="text-success text-sm mt-2">+18% from last month</p>
        </div>

        <div 
          onClick={() => navigate('/admin/products?filter=low-stock')}
          className="bg-surface rounded-lg p-6 border border-border cursor-pointer hover:border-accent hover:bg-bg-hover transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-secondary font-medium">Products</h3>
            <div className="w-10 h-10 rounded-full bg-success-muted flex items-center justify-center text-success">
              <Package size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">{totalProducts}</p>
          <p className="text-secondary text-sm mt-2">
            <span className={lowStockCount > 0 ? "text-error font-semibold" : ""}>
              {lowStockCount} low stock
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface rounded-lg p-6 border border-border lg:col-span-2 flex flex-col justify-between">
          <h3 className="text-xl font-semibold mb-4">Recent Sales Chart</h3>
          <div className="flex-grow flex items-center justify-center">
            <RecentSalesChart />
          </div>
        </div>
        
        <div className="bg-surface rounded-lg p-6 border border-border">
          <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-secondary text-sm">No orders have been placed yet.</p>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-primary">#{order.orderNumber}</p>
                    <p className="text-sm text-secondary">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">{formatPrice(order.total)}</p>
                    <span className="text-xs bg-success-muted text-success px-2 py-1 rounded capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          {orders.length > 0 && (
            <div className="mt-8 flex justify-end pt-4 border-t border-border">
              <button 
                onClick={() => setIsOrdersModalOpen(true)}
                className="text-sm font-medium text-gold transition-colors flex items-center gap-1"
                style={{ cursor: 'pointer' }}
              >
                View All
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isOrdersModalOpen} 
        onClose={() => setIsOrdersModalOpen(false)}
        title="All Orders"
        size="lg"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {orders.map(order => (
            <div key={order.id} className="bg-surface p-4 rounded-lg border border-border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-primary">#{order.orderNumber}</h4>
                  <p className="text-sm text-secondary">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                  <span className="text-xs bg-success-muted text-success px-2 py-1 rounded capitalize mt-1 inline-block">
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <h5 className="text-sm font-medium mb-2 text-primary">Items</h5>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-secondary">{item.quantity}x {item.name}</span>
                      <span className="text-primary">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {order.shippingAddress && (
                <div className="border-t border-border pt-4 mt-4">
                  <h5 className="text-sm font-medium mb-2 text-primary">Shipping To</h5>
                  <p className="text-sm text-secondary">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
