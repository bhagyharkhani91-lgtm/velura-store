import { useState } from 'react';
import { Container } from '../../../components/layout/Container/Container';
import { useAuthStore } from '../../../stores/authStore';
import { useOrdersStore } from '../../../stores/ordersStore';
import { useMessagesStore } from '../../../stores/messagesStore';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatDate } from '../../../utils';
import { PackageSearch, Eye, MapPin, CreditCard, Package } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal/Modal';
import type { Order } from '../../../types/order';
import './MyOrdersPage.css';

export function MyOrdersPage() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { getOrdersByUserId, updateOrderStatus } = useOrdersStore();
  const { sendMessage } = useMessagesStore();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  const closeModal = () => {
    setSelectedOrder(null);
    setIsCancelling(false);
    setCancelReason('');
    setCustomReason('');
  };

  if (isLoading) {
    return <Container className="py-24 text-center"><div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div></Container>;
  }

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const myOrders = getOrdersByUserId(user.id);

  const handleCancelSubmit = async () => {
    if (!selectedOrder || !user) return;
    
    const finalReason = cancelReason === 'Other' ? customReason : cancelReason;
    if (!finalReason.trim()) {
       alert("Please provide a reason for cancellation.");
       return;
    }
    
    setIsSubmittingCancel(true);
    try {
      await updateOrderStatus(selectedOrder.id, 'cancelled');
      await sendMessage(
         user.name || 'Customer', 
         user.email || '', 
         `Order Cancel Reason: #${selectedOrder.orderNumber}`, 
         `Order cancelled by customer.\nReason: ${finalReason}`
      );
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setIsSubmittingCancel(false);
    }
  };

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
                      <div className="order-item-price ml-auto flex flex-col items-end gap-2">
                        <span>{formatPrice(item.price * item.quantity)}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="flex items-center gap-1 text-xs font-semibold uppercase text-gold hover:text-gold-hover transition-colors tracking-widest"
                        >
                          <Eye size={12} /> View Details
                        </button>
                      </div>
                    </div>
                  ))}
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
            {isCancelling ? (
               <div className="bg-bg-secondary p-6 rounded-lg border border-border">
                 <h3 className="text-xl font-semibold text-primary mb-4">Cancel Order</h3>
                 <p className="text-sm text-secondary mb-4">Please select a reason for cancelling this order.</p>
                 
                 <div className="flex flex-col gap-3 mb-6">
                   {['Changed my mind', 'Found a better price', 'Order placed by mistake', 'Expected delivery time is too long', 'Other'].map(reason => (
                     <label key={reason} className="flex items-center gap-3 cursor-pointer">
                       <input 
                         type="radio" 
                         name="cancelReason" 
                         value={reason} 
                         checked={cancelReason === reason}
                         onChange={(e) => setCancelReason(e.target.value)}
                         className="w-4 h-4 text-accent focus:ring-accent bg-surface border-border"
                       />
                       <span className="text-primary">{reason}</span>
                     </label>
                   ))}
                 </div>
                 
                 {cancelReason === 'Other' && (
                   <textarea
                     placeholder="Please tell us what went wrong..."
                     value={customReason}
                     onChange={(e) => setCustomReason(e.target.value)}
                     className="w-full bg-surface border border-border rounded-md p-3 text-primary placeholder:text-secondary focus:outline-none focus:border-accent resize-none mb-6"
                     rows={3}
                   />
                 )}
                 
                 <div className="flex justify-end gap-4">
                   <button 
                     onClick={() => setIsCancelling(false)} 
                     className="px-4 py-2 border border-border rounded-md text-primary hover:bg-bg-hover transition-colors font-medium text-sm"
                     disabled={isSubmittingCancel}
                   >
                     Back
                   </button>
                   <button 
                     onClick={handleCancelSubmit} 
                     className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium text-sm"
                     disabled={isSubmittingCancel}
                   >
                     {isSubmittingCancel ? 'Cancelling...' : 'Confirm Cancellation'}
                   </button>
                 </div>
               </div>
            ) : (
              <>
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
            
            {/* Cancel Order Button */}
            {['pending', 'confirmed', 'processing'].includes(selectedOrder.status) && (
              <div className="flex justify-end mt-2">
                <button 
                  onClick={() => setIsCancelling(true)}
                  className="px-4 py-2 border border-red-500/30 text-red-500 rounded-md hover:bg-red-500/10 transition-colors font-medium text-sm"
                >
                  Cancel Order
                </button>
              </div>
            )}
            </>
            )}
          </div>
        )}
      </Modal>
    </Container>
  );
}
