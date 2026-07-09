import { Modal } from '../../../../components/ui/Modal/Modal';
import type { Order } from '../../../../types/order';
import { formatPrice } from '../../../../utils';
import { MapPin, Phone, Mail, User, Package, Calendar } from 'lucide-react';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <Modal 
      isOpen={!!order} 
      onClose={onClose} 
      title={`Order Details - #${order.orderNumber}`}
      size="xl"
    >
      <div className="flex flex-col gap-6">
        {/* Status Header */}
        <div className="flex justify-between items-center bg-bg-secondary p-4 rounded-lg border border-border">
          <div className="flex items-center gap-2 text-sm text-secondary">
            <Calendar size={16} />
            <span>{new Date(order.createdAt).toLocaleString('en-IN')}</span>
          </div>
          <span className={`inline-block text-xs px-2.5 py-1 rounded-md font-semibold capitalize bg-surface text-primary border border-border`}>
            {order.status}
          </span>
        </div>

        {/* Customer Information */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">Customer Details</h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-start gap-2">
              <User size={16} className="text-secondary mt-0.5" />
              <span className="text-primary font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</span>
            </div>
            {(order.shippingAddress as any).email && (
              <div className="flex items-start gap-2">
                <Mail size={16} className="text-secondary mt-0.5" />
                <span className="text-primary">{(order.shippingAddress as any).email}</span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <Phone size={16} className="text-secondary mt-0.5" />
              <span className="text-primary">{order.shippingAddress.phone}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">Shipping Address</h3>
          <div className="flex items-start gap-2 text-sm">
            <MapPin size={16} className="text-secondary mt-0.5 flex-shrink-0" />
            <div className="text-primary flex flex-col">
              <span>{order.shippingAddress.street} {order.shippingAddress.apartment}</span>
              <span>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</span>
              <span>{order.shippingAddress.country}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-primary border-b border-border pb-2 flex items-center gap-2">
            <Package size={18} /> Products
          </h3>
          <div className="flex flex-col gap-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-bg-secondary p-3 rounded-lg border border-border">
                <div 
                  className="rounded-md overflow-hidden bg-surface flex-shrink-0"
                  style={{ width: '80px', height: '80px' }}
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-primary truncate">{item.name}</h4>
                  {item.variant && <p className="text-xs text-secondary">{item.variant}</p>}
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-secondary">Qty: {item.quantity}</span>
                    <span className="text-sm font-medium text-primary">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">Order Summary</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-secondary">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Shipping</span>
              <span>{order.shipping.cost === 0 ? 'Free' : formatPrice(order.shipping.cost)}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between text-secondary">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-primary text-base pt-2 border-t border-border mt-1">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-secondary flex justify-between items-center bg-bg-secondary p-2 rounded">
            <span>Payment Method</span>
            <span className="font-medium text-primary uppercase">{order.paymentMethod}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
