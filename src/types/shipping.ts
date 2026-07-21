export type ShipmentStatus =
  | 'NEW'
  | 'AWB_ASSIGNED'
  | 'PICKUP_SCHEDULED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RTO_INITIATED'
  | 'RTO_DELIVERED';

export interface Shipment {
  id: string;
  order_id: string;
  order_number: string;
  shipment_id: string;
  sr_order_id: number;
  awb_code: string | null;
  courier_name: string | null;
  courier_id: number | null;
  status: ShipmentStatus;
  label_url: string | null;
  manifest_url: string | null;
  pickup_token_number: string | null;
  pickup_scheduled_date: string | null;
  customer_name: string;
  customer_phone: string;
  destination_city: string;
  destination_state: string;
  payment_method: string;
  total: number;
  items: Array<{ name: string; sku: string; units: number; selling_price: number }>;
  tracking_data: ShipmentTracking | null;
  created_at: string;
  updated_at: string;
}

export interface ShipmentTracking {
  awb_code: string;
  courier_name: string;
  current_status: string;
  current_status_id: number;
  shipment_status: string;
  shipment_status_id: number;
  etd: string | null;
  scan: Array<{
    status: string;
    status_type: string;
    location: string;
    date: string;
    activity: string;
    sr_status_label: string;
  }>;
}
