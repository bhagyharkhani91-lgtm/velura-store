import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Shipment, ShipmentTracking } from '../types/shipping';
import {
  createShiprocketOrder,
  generateAWB as generateAWBClient,
  requestPickup as requestPickupClient,
  trackShipment as trackShipmentClient,
  cancelShipment as cancelShipmentClient,
  generateLabel as generateLabelClient,
} from '../lib/shiprocket';

interface ShipmentStore {
  shipments: Shipment[];
  isLoading: boolean;
  error: string | null;
  fetchShipments: () => Promise<void>;
  createShipment: (order: {
    id: string;
    orderNumber: string;
    items: Array<{ productId: string; name: string; price: number; quantity: number }>;
    subtotal: number;
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
      email?: string;
      landmark?: string;
    };
    paymentMethod: string;
  }) => Promise<Shipment | null>;
  assignAWB: (shipmentId: string) => Promise<void>;
  requestPickup: (shipmentId: string) => Promise<void>;
  refreshTracking: (shipmentId: string) => Promise<void>;
  cancelShipment: (shipmentId: string) => Promise<void>;
  generateLabel: (shipmentId: string) => Promise<void>;
  deleteShipment: (shipmentId: string) => Promise<void>;
  getShipmentByOrderId: (orderId: string) => Shipment | undefined;
}

export const useShipmentStore = create<ShipmentStore>()((set, get) => ({
  shipments: [],
  isLoading: false,
  error: null,

  fetchShipments: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const shipments: Shipment[] = (data || []).map((d: any) => ({
        id: d.id,
        order_id: d.order_id,
        order_number: d.order_number,
        shipment_id: d.shipment_id,
        sr_order_id: d.sr_order_id,
        awb_code: d.awb_code,
        courier_name: d.courier_name,
        courier_id: d.courier_id,
        status: d.status,
        label_url: d.label_url,
        manifest_url: d.manifest_url,
        pickup_token_number: d.pickup_token_number,
        pickup_scheduled_date: d.pickup_scheduled_date,
        customer_name: d.customer_name,
        customer_phone: d.customer_phone,
        destination_city: d.destination_city,
        destination_state: d.destination_state,
        payment_method: d.payment_method,
        total: d.total,
        items: d.items,
        tracking_data: d.tracking_data,
        created_at: d.created_at,
        updated_at: d.updated_at,
      }));

      set({ shipments, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createShipment: async (order) => {
    try {
      const fullName = `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.trim();
      const phone = (order.shippingAddress as any).phone || '';
      const landmark = (order.shippingAddress as any).landmark || '';

      const address1 = order.shippingAddress.street || '';
      const address2 = order.shippingAddress.apartment || '';

      const billingAddress = [address1, address2].filter(Boolean).join(', ');
      const billingAddress2 = landmark || '';

      const srResult = await createShiprocketOrder({
        order_id: order.orderNumber,
        pickup_location: 'Primary',
        billing_customer_name: fullName,
        billing_last_name: order.shippingAddress.lastName || order.shippingAddress.firstName,
        billing_address: billingAddress,
        billing_address_2: billingAddress2,
        billing_city: order.shippingAddress.city,
        billing_pincode: order.shippingAddress.zipCode,
        billing_state: order.shippingAddress.state,
        billing_country: order.shippingAddress.country || 'India',
        billing_email: (order.shippingAddress as any).email || '',
        billing_phone: phone,
        order_items: order.items.map((item) => ({
          name: item.name,
          sku: item.productId,
          units: item.quantity,
          selling_price: item.price,
        })),
        payment_method: order.paymentMethod.includes('COD') ? 'COD' : 'Prepaid',
        sub_total: order.subtotal,
        length: 10,
        breadth: 10,
        height: 10,
        weight: order.items.reduce((sum) => sum + 0.3, 0.5),
      });

      const shipmentData: any = {
        id: crypto.randomUUID(),
        order_id: order.id,
        order_number: order.orderNumber,
        shipment_id: String(srResult.shipment_id),
        sr_order_id: Number(srResult.sr_order_id),
        awb_code: null,
        courier_name: srResult.courier_name,
        courier_id: null,
        status: 'NEW',
        label_url: null,
        manifest_url: null,
        pickup_token_number: null,
        pickup_scheduled_date: null,
        customer_name: fullName,
        customer_phone: phone,
        destination_city: order.shippingAddress.city,
        destination_state: order.shippingAddress.state,
        payment_method: order.paymentMethod,
        total: order.subtotal,
        items: order.items.map((item) => ({
          name: item.name,
          sku: item.productId,
          units: item.quantity,
          selling_price: item.price,
        })),
        tracking_data: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('shipments').insert([shipmentData]);
      if (error) throw error;

      const newShipment: Shipment = shipmentData as Shipment;

      set((state) => ({
        shipments: [newShipment, ...state.shipments],
      }));

      return newShipment;
    } catch (err: any) {
      console.error('createShipment error:', err);
      set({ error: err.message });
      return null;
    }
  },

  assignAWB: async (shipmentId) => {
    try {
      const shipment = get().shipments.find((s) => s.id === shipmentId);
      if (!shipment) throw new Error('Shipment not found');

      const awbResult = await generateAWBClient(shipment.shipment_id);

      const updates: any = {
        awb_code: awbResult.awb_code,
        courier_name: awbResult.courier_name || shipment.courier_name,
        courier_id: awbResult.courier_id,
        status: awbResult.awb_code ? 'AWB_ASSIGNED' : shipment.status,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('shipments')
        .update(updates)
        .eq('id', shipmentId);

      if (error) throw error;

      set((state) => ({
        shipments: state.shipments.map((s) =>
          s.id === shipmentId ? { ...s, ...updates } : s
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  requestPickup: async (shipmentId) => {
    try {
      const shipment = get().shipments.find((s) => s.id === shipmentId);
      if (!shipment) throw new Error('Shipment not found');

      await requestPickupClient(Number(shipment.shipment_id));

      const updates = {
        status: 'PICKUP_SCHEDULED' as const,
        pickup_scheduled_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('shipments')
        .update(updates)
        .eq('id', shipmentId);

      if (error) throw error;

      set((state) => ({
        shipments: state.shipments.map((s) =>
          s.id === shipmentId ? { ...s, ...updates } : s
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  refreshTracking: async (shipmentId) => {
    try {
      const shipment = get().shipments.find((s) => s.id === shipmentId);
      if (!shipment || !shipment.awb_code) throw new Error('No AWB code available');

      const trackingResult = await trackShipmentClient(shipment.awb_code);

      const trackingData: ShipmentTracking = {
        awb_code: shipment.awb_code,
        courier_name: trackingResult.courier_name || shipment.courier_name || '',
        current_status: trackingResult.current_status || '',
        current_status_id: trackingResult.current_status_id || 0,
        shipment_status: trackingResult.shipment_status || '',
        shipment_status_id: trackingResult.shipment_status_id || 0,
        etd: trackingResult.etd || null,
        scan: trackingResult.scan || [],
      };

      const newStatus = trackingData.shipment_status || shipment.status;

      const { error } = await supabase
        .from('shipments')
        .update({
          status: newStatus,
          tracking_data: trackingData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', shipmentId);

      if (error) throw error;

      set((state) => ({
        shipments: state.shipments.map((s) =>
          s.id === shipmentId
            ? { ...s, status: newStatus as any, tracking_data: trackingData, updated_at: new Date().toISOString() }
            : s
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  cancelShipment: async (shipmentId) => {
    try {
      const shipment = get().shipments.find((s) => s.id === shipmentId);
      if (!shipment) throw new Error('Shipment not found');

      await cancelShipmentClient(shipment.sr_order_id);

      const updates = {
        status: 'CANCELLED' as const,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('shipments')
        .update(updates)
        .eq('id', shipmentId);

      if (error) throw error;

      set((state) => ({
        shipments: state.shipments.map((s) =>
          s.id === shipmentId ? { ...s, ...updates } : s
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  generateLabel: async (shipmentId) => {
    try {
      const shipment = get().shipments.find((s) => s.id === shipmentId);
      if (!shipment) throw new Error('Shipment not found');

      const labelResult = await generateLabelClient(shipment.shipment_id);

      const updates: any = {
        label_url: labelResult.label_url,
        updated_at: new Date().toISOString(),
      };

      if (!labelResult.label_url && labelResult.response) {
        updates.label_url = labelResult.response.label_url || labelResult.response.data?.label_url || null;
      }

      const { error } = await supabase
        .from('shipments')
        .update(updates)
        .eq('id', shipmentId);

      if (error) throw error;

      set((state) => ({
        shipments: state.shipments.map((s) =>
          s.id === shipmentId ? { ...s, ...updates } : s
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteShipment: async (shipmentId) => {
    try {
      const { error } = await supabase
        .from('shipments')
        .delete()
        .eq('id', shipmentId);

      if (error) throw error;

      set((state) => ({
        shipments: state.shipments.filter((s) => s.id !== shipmentId),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  getShipmentByOrderId: (orderId) => {
    return get().shipments.find((s) => s.order_id === orderId);
  },
}));
