// ============================================
// Order Types
// ============================================

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'returned';

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface ShippingInfo {
  method: string;
  cost: number;
  estimatedDays: string;
  trackingNumber?: string;
  carrier?: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: ShippingInfo;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  timeline: OrderTimeline[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  couponCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
