import { useState } from 'react';
import { Button } from '../../../components/ui/Button/Button';
import { Search, Eye, Download, Package } from 'lucide-react';
import { useOrdersStore } from '../../../stores/ordersStore';
import { formatPrice } from '../../../utils';

const TABS = [
  { id: 'on-hold', label: 'On Hold', statuses: ['processing'] },
  { id: 'pending', label: 'Pending', statuses: ['pending'] },
  { id: 'ready-to-ship', label: 'Ready to Ship', statuses: ['confirmed'] },
  { id: 'shipped', label: 'Shipped', statuses: ['shipped', 'delivered'] },
  { id: 'cancelled', label: 'Cancelled', statuses: ['cancelled', 'refunded', 'returned'] }
];

export function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrdersStore();
  const [activeTab, setActiveTab] = useState('on-hold');

  const filteredOrders = orders.filter(order => {
    const tab = TABS.find(t => t.id === activeTab);
    return tab ? tab.statuses.includes(order.status) : true;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-success-muted text-success border border-success/20';
      case 'shipped':
      case 'sent': return 'bg-info-muted text-info border border-info/20';
      case 'pending': return 'bg-warning-muted text-warning border border-warning/20';
      case 'cancelled': return 'bg-error-muted text-error border border-error/20';
      default: return 'bg-bg-secondary text-secondary border border-border';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="heading-3xl">Orders Management</h1>
        <Button variant="outline" leftIcon={<Download size={18} />}>Export CSV</Button>
      </div>

      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border">
          {TABS.map(tab => {
            const count = orders.filter(o => tab.statuses.includes(o.status)).length;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                  isActive 
                    ? 'border-accent text-accent' 
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
              >
                {tab.label}
                {['on-hold', 'pending', 'ready-to-ship'].includes(tab.id) && (
                  <span>({count})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-bg-secondary/20">
          <div className="flex items-center gap-3">
            <span className="text-sm text-secondary whitespace-nowrap">Filter by :</span>
            <div className="relative">
              <select 
                className="bg-surface border border-border rounded-md text-sm text-primary focus:outline-none focus:border-accent cursor-pointer"
                style={{ 
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  paddingLeft: '1rem',
                  paddingRight: '2.5rem',
                  paddingTop: '0.625rem',
                  paddingBottom: '0.625rem',
                  minWidth: '160px',
                  height: '42px'
                }}
              >
                <option>Order Date</option>
                <option>Total Amount</option>
                <option>Customer Name</option>
              </select>
              <div 
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ right: '0.75rem' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative h-[42px]">
              <select 
                className="bg-surface border border-border rounded-md text-sm text-secondary focus:outline-none focus:border-accent cursor-pointer h-full transition-colors w-full"
                style={{ 
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  paddingLeft: '1rem',
                  paddingRight: '2.5rem',
                  minWidth: '140px' 
                }}
              >
                <option>SKU ID</option>
                <option>Order ID</option>
                <option>Customer Email</option>
              </select>
              <div 
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ right: '0.75rem' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
            
            <div className="relative h-[42px] flex items-center">
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="bg-surface border border-border rounded-md text-sm text-primary focus:outline-none focus:border-accent h-full transition-colors w-full"
                style={{ 
                  paddingLeft: '1rem',
                  paddingRight: '2.5rem',
                  width: '260px' 
                }}
              />
              <Search 
                className="absolute text-secondary" 
                size={16} 
                style={{ right: '0.75rem' }}
              />
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-surface">
            <div className="relative mb-6">
              <Package size={56} strokeWidth={1} className="text-secondary/60" />
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3.5 h-5 bg-secondary/30"></div>
              <div className="absolute bottom-1 -left-4 w-5 h-[1px] bg-border"></div>
              <div className="absolute bottom-3 -left-4 w-3 h-[1px] bg-border"></div>
              <div className="absolute bottom-0 -right-6 w-12 h-[1px] bg-border"></div>
              <div className="absolute bottom-0 -left-6 w-16 h-[1px] bg-border"></div>
            </div>
            <h3 className="text-base font-semibold text-primary mb-1">No orders yet</h3>
            <p className="text-sm text-secondary">But keep checking this section from time to time.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary/30 text-secondary text-sm border-b border-border">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Fulfillment</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-border hover:bg-bg-hover transition-colors">
                  <td className="p-4 font-medium text-primary">#{order.orderNumber}</td>
                  <td className="p-4 text-secondary">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-primary">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p className="text-xs text-secondary">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  </td>
                  <td className="p-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <span className="text-xs bg-success-muted text-success px-2 py-1 rounded">{order.paymentMethod}</span>
                  </td>
                  <td className="p-4">
                    {order.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => updateOrderStatus(order.id, 'confirmed' as any)}>
                          Accept
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => updateOrderStatus(order.id, 'cancelled' as any)}>
                          Decline
                        </Button>
                      </div>
                    ) : order.status === 'confirmed' ? (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'shipped' as any)}>
                        Sent
                      </Button>
                    ) : order.status === 'shipped' ? (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'delivered' as any)}>
                        Delivered
                      </Button>
                    ) : (
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-md font-semibold capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-secondary hover:text-accent transition-colors">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
