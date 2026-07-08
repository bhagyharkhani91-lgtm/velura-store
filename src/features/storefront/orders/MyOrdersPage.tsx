import { useState } from 'react';
import { Container } from '../../../components/layout/Container/Container';
import { useAuthStore } from '../../../stores/authStore';
import { useOrdersStore } from '../../../stores/ordersStore';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatDate } from '../../../utils';
import { PackageSearch, Eye, MapPin, CreditCard, Package } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal/Modal';
import type { Order } from '../../../types/order';
import './MyOrdersPage.css';

export function MyOrdersPage() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { getOrdersByUserId } = useOrdersStore();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const closeModal = () => setSelectedOrder(null);

  if (isLoading) {
    return <Container className="py-24 text-center"><div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div></Container>;
  }

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const myOrders = getOrdersByUserId(user.id);

  return (
    <Container className="py-12">
      <div className="orders-page-header mb-8">
        <h1 className="heading-3xl">My Orders</h1>
        <p className="text-secondary mt-2">View and track your past purchases.</p>
      </div>

      {myOrders.length === 0 ? (
        <div className="orders-empty-state">
          <div className="orders-empty-icon">
            <PackageSearch size={48} strokeWidth={1.5} />
          </div>
          <h3 className="heading-xl mt-6 mb-2">No orders yet</h3>
          <p className="text-secondary mb-6">Looks like you haven't made any purchases yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Explore Products
          </button>
        </div>
      ) : (
        <div className="orders-list space-y-6">
          {myOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <p className="text-sm text-secondary">Order Placed</p>
                  <p className="font-medium text-primary">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary">Total</p>
                  <p className="font-medium text-primary">{formatPrice(order.total)}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary">Order #</p>
                  <p className="font-medium text-primary">{order.orderNumber}</p>
                </div>
                <div className="order-status-badge ml-auto">
                  <span className={`status-${order.status}`}>{order.status}</span>
                </div>
              </div>
              <div className="order-card-body">
                <div className="order-items-preview">
                  {order.items.map(item => (
                    <div key={`${item.productId}-${item.variantId}`} className="order-item-row">
                      <div className="order-item-image-placeholder">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <div className="image-fallback">
                            {item.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="order-item-details">
                        <p className="font-medium text-primary">{item.name}</p>
                        {item.variant && <p className="text-xs text-secondary">Variant: {item.variant}</p>}
                        <p className="text-xs text-secondary">Qty: {item.quantity}</p>
                      </div>
                      <div className="order-item-price ml-auto">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-card-footer">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-2 text-xs font-semibold uppercase text-gold hover:text-gold-hover transition-colors tracking-widest"
                  >
                    <Eye size={16} /> VIEW DETAILS
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedOrder}
        onClose={closeModal}
        title={selectedOrder ? `Order Details #${selectedOrder.orderNumber}` : ''}
        size="lg"
      >
        {selectedOrder && (
          <div className="flex flex-col gap-6">
            {/* Status & Date */}
            <div className="flex justify-between items-center bg-bg-secondary p-6 rounded-lg border border-border">
              <div>
                <p className="text-sm text-secondary mb-1">Date Placed</p>
                <p className="font-medium text-primary text-lg">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-secondary mb-2">Current Status</p>
                <span className={`status-${selectedOrder.status} inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-bg-secondary p-6 rounded-lg border border-border">
              <h3 className="font-semibold text-primary mb-6 flex items-center gap-2">
                <Package size={18} className="text-accent" /> Tracking History
              </h3>
              <div className="flex flex-col gap-0">
                {selectedOrder.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-accent flex-shrink-0" style={{ width: '12px', height: '12px', marginTop: '6px' }}></div>
                      {index !== selectedOrder.timeline.length - 1 && (
                        <div className="bg-border" style={{ width: '2px', height: '100%', minHeight: '24px', margin: '4px 0' }}></div>
                      )}
                    </div>
                    <div className={index !== selectedOrder.timeline.length - 1 ? "pb-6" : ""}>
                      <p className="font-medium text-primary capitalize">{event.status}</p>
                      <p className="text-xs text-secondary mt-1">
                        {new Date(event.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Information */}
              <div className="bg-bg-secondary p-6 rounded-lg border border-border flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-accent" /> Shipping Address
                  </h3>
                  <p className="text-sm text-primary font-medium mb-2">
                    {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                  </p>
                  {selectedOrder.shippingAddress.street && <p className="text-sm text-secondary">{selectedOrder.shippingAddress.street}</p>}
                  {selectedOrder.shippingAddress.apartment && <p className="text-sm text-secondary">{selectedOrder.shippingAddress.apartment}</p>}
                  <p className="text-sm text-secondary">
                    {[selectedOrder.shippingAddress.city, selectedOrder.shippingAddress.state, selectedOrder.shippingAddress.zipCode].filter(Boolean).join(', ')}
                  </p>
                  {selectedOrder.shippingAddress.phone && <p className="text-sm text-secondary mt-3">Phone: {selectedOrder.shippingAddress.phone}</p>}
                </div>
                
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-sm font-medium text-primary mb-1">Shipping Method</p>
                  <p className="text-sm text-secondary">{selectedOrder.shipping.method} ({selectedOrder.shipping.estimatedDays})</p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-bg-secondary p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                  <CreditCard size={18} className="text-accent" /> Payment Summary
                </h3>
                <p className="text-sm text-secondary mb-6">Method: {selectedOrder.paymentMethod}</p>
                
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Subtotal</span>
                    <span className="text-primary">{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Shipping</span>
                    <span className="text-primary">{formatPrice(selectedOrder.shipping.cost)}</span>
                  </div>
                  {selectedOrder.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">Tax</span>
                      <span className="text-primary">{formatPrice(selectedOrder.tax)}</span>
                    </div>
                  )}
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">Discount</span>
                      <span className="text-success">-{formatPrice(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold pt-4 mt-1 border-t border-border text-base">
                    <span className="text-primary">Total</span>
                    <span className="text-gold">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Container>
  );
}
