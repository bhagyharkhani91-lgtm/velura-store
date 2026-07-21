const API = '/api/shiprocket';

async function fetchShiprocket(action: string, data: any) {
  const { data: { session } } = await (await import('./supabase')).supabase.auth.getSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const response = await fetch(API, {
    method: 'POST',
    headers,
    body: JSON.stringify({ action, data }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || `Shiprocket API error: ${response.status}`);
  }
  return result;
}

export const SHIPROCKET_STATUS_LABELS: Record<string, string> = {
  NEW: 'New',
  AWB_ASSIGNED: 'AWB Assigned',
  PICKUP_SCHEDULED: 'Pickup Scheduled',
  PICKUP_QUEUED: 'Pickup Queued',
  PICKUP_EXCEPTION: 'Pickup Exception',
  PICKUP_RESCHEDULED: 'Pickup Rescheduled',
  IN_TRANSIT: 'In Transit',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RTO_INITIATED: 'RTO Initiated',
  RTO_DELIVERED: 'RTO Delivered',
};

export function getShiprocketStatusLabel(status: string): string {
  return SHIPROCKET_STATUS_LABELS[status] || status || 'Unknown';
}

export interface CreateOrderInput {
  order_id: string;
  pickup_location: string;
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address?: string;
  billing_address_2?: string;
  billing_city?: string;
  billing_pincode: string;
  billing_state?: string;
  billing_country?: string;
  billing_email?: string;
  billing_phone?: string;
  order_items: Array<{ name: string; sku: string; units: number; selling_price: number }>;
  payment_method?: string;
  sub_total?: number;
  length?: number;
  breadth?: number;
  height?: number;
  weight?: number;
}

export async function createShiprocketOrder(input: CreateOrderInput) {
  const result = await fetchShiprocket('create-order', {
    order_id: input.order_id,
    order_date: new Date().toISOString(),
    pickup_location: input.pickup_location,
    billing_customer_name: input.billing_customer_name,
    billing_last_name: input.billing_last_name || input.billing_customer_name.split(' ').pop() || '',
    billing_address: input.billing_address || input.billing_customer_name,
    billing_address_2: input.billing_address_2 || '',
    billing_city: input.billing_city || '',
    billing_pincode: input.billing_pincode,
    billing_state: input.billing_state || '',
    billing_country: input.billing_country || 'India',
    billing_email: input.billing_email || '',
    billing_phone: input.billing_phone || '',
    order_items: input.order_items,
    payment_method: input.payment_method || 'Prepaid',
    sub_total: input.sub_total,
    length: input.length || 10,
    breadth: input.breadth || 10,
    height: input.height || 10,
    weight: input.weight || 0.5,
  });

  return {
    order_id: result.order_id,
    shipment_id: result.shipment_id,
    sr_order_id: result.order_id,
    courier_name: result.courier_name || null,
  };
}

export async function generateAWB(shipmentId: number | string) {
  const result = await fetchShiprocket('generate-awb', { shipment_id: String(shipmentId) });

  return {
    awb_code: result.response?.data?.awb_code || null,
    courier_name: result.response?.data?.courier_name || null,
    courier_id: result.response?.data?.courier_company_id || null,
  };
}

export async function requestPickup(shipmentId: number | string) {
  return fetchShiprocket('request-pickup', { shipment_id: Number(shipmentId) });
}

export async function trackShipment(awbCode: string) {
  return fetchShiprocket('track', { awb_code: awbCode });
}

export async function cancelShipment(srOrderId: number) {
  return fetchShiprocket('cancel', { ids: [srOrderId] });
}

export async function generateLabel(shipmentId: number | string) {
  const result = await fetchShiprocket('generate-label', { shipment_id: Number(shipmentId) });
  return {
    label_url: result.label_url || result.response?.data?.label_url || null,
    response: result.response,
  };
}

export interface ServiceabilityResult {
  serviceable: boolean;
  couriers: Array<{
    courier_name: string;
    courier_company_id: number;
    min_weight: number;
    rate: number;
    cod: boolean;
  }>;
  message: string;
  pickup_postcode: string;
  delivery_postcode: string;
}

export async function checkServiceability(deliveryPostcode: string, weight?: number, cod?: number): Promise<ServiceabilityResult> {
  const result = await fetchShiprocket('check-serviceability', {
    delivery_postcode: deliveryPostcode,
    weight: weight || 0.5,
    cod: cod || 0,
  });

  const isServiceable = result.status === 200 || result.data?.available_courier_companies?.length > 0;

  return {
    serviceable: isServiceable,
    couriers: result.data?.available_courier_companies || [],
    message: result.message || (isServiceable ? 'Serviceable' : 'Not serviceable'),
    pickup_postcode: result.pickup_postcode || '',
    delivery_postcode: result.delivery_postcode || deliveryPostcode,
  };
}
