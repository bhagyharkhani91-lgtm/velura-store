import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { sendShipmentConfirmationEmail } from '../utils/emailService';
import type { Order, OrderStatus } from '../types/order';

interface OrdersStore {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: (userId?: string) => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updatePaymentStatus: (orderId: string, status: 'pending' | 'paid') => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByUserId: (userId: string) => Order[];
  getTotalRevenue: () => number;
  getTotalOrdersCount: () => number;
}

export const useOrdersStore = create<OrdersStore>()((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async (userId?: string) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      // Transform snake_case from DB to camelCase for the frontend type
      const formattedOrders: Order[] = (data || []).map(d => ({
        id: d.id,
        orderNumber: d.order_number,
        userId: d.user_id,
        items: d.items,
        subtotal: Number(d.subtotal),
        shipping: d.shipping,
        tax: Number(d.tax),
        discount: Number(d.discount),
        total: Number(d.total),
        status: d.status,
        timeline: d.timeline,
        shippingAddress: d.shipping_address,
        paymentMethod: d.payment_method,
        paymentStatus: d.shipping?.paymentStatus || 'paid',
        couponCode: d.coupon_code,
        notes: d.notes,
        createdAt: d.created_at,
        updatedAt: d.updated_at
      }));
      
      set({ orders: formattedOrders, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addOrder: async (order) => {
    try {
       const dbOrder = {
          id: order.id,
          order_number: order.orderNumber,
          user_id: order.userId,
          items: order.items,
          subtotal: order.subtotal,
          shipping: { ...order.shipping, paymentStatus: order.paymentStatus || 'paid' },
          tax: order.tax,
          discount: order.discount,
          total: order.total,
          status: order.status,
          timeline: order.timeline,
          shipping_address: order.shippingAddress,
          payment_method: order.paymentMethod,
          coupon_code: order.couponCode,
          notes: order.notes,
          created_at: order.createdAt,
          updated_at: order.updatedAt
       };
       
       const { error } = await supabase.from('orders').insert([dbOrder]);
       if (error) throw error;
       
       set((state) => ({
         orders: [order, ...state.orders],
       }));
    } catch(err) {
       console.error("Error adding order", err);
       throw err;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const order = get().orders.find(o => o.id === orderId);
      if (!order) return;
      
      const newTimeline = [
        { status, timestamp: new Date().toISOString() },
        ...order.timeline,
      ];
      const newUpdatedAt = new Date().toISOString();
      
      const { error } = await supabase
        .from('orders')
        .update({ 
           status: status, 
           timeline: newTimeline,
           updated_at: newUpdatedAt
        })
        .eq('id', orderId);
        
      if (error) throw error;

      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId
            ? { ...o, status, timeline: newTimeline, updatedAt: newUpdatedAt }
            : o
        ),
      }));

      if (status === 'shipped') {
        const email = (order.shippingAddress as any).email;
        if (email) {
          sendShipmentConfirmationEmail({
            id: order.id,
            orderNumber: order.orderNumber,
            items: order.items,
            total: order.total,
            shippingAddress: { ...order.shippingAddress, email },
          });
        }
      }
    } catch (err) {
      console.error("Error updating order", err);
    }
  },

  updatePaymentStatus: async (orderId, status) => {
    try {
      const order = get().orders.find(o => o.id === orderId);
      if (!order) return;
      
      const newUpdatedAt = new Date().toISOString();
      
      const { error } = await supabase
        .from('orders')
        .update({ 
           shipping: { ...order.shipping, paymentStatus: status },
           updated_at: newUpdatedAt
        })
        .eq('id', orderId);
        
      if (error) throw error;

      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId
            ? { ...o, paymentStatus: status, updatedAt: newUpdatedAt }
            : o
        ),
      }));
    } catch (err) {
      console.error("Error updating payment status", err);
    }
  },

  getOrderById: (orderId) => {
    return get().orders.find((o) => o.id === orderId);
  },

  getOrdersByUserId: (userId) => {
    return get().orders.filter((o) => o.userId === userId);
  },

  getTotalRevenue: () => {
    return get().orders
      .filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')
      .reduce((sum, order) => sum + order.total, 0);
  },

  getTotalOrdersCount: () => {
    return get().orders.length;
  }
}));
