import { applyCors, rateLimit, requireAuth } from './security.js';

const SHIPROCKET_BASE = 'https://apiv2.shiprocket.in/v1/external';

let cachedToken = null;
let tokenExpiry = 0;

async function getAuthToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error('Shiprocket credentials not configured (SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD)');
  }

  const response = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!data.token) {
    throw new Error(data.message || 'Shiprocket authentication failed');
  }

  cachedToken = data.token;
  tokenExpiry = Date.now() + 5 * 60 * 1000;
  return data.token;
}

async function shiprocketFetch(path, options = {}) {
  const token = await getAuthToken();
  const url = `${SHIPROCKET_BASE}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  return response.json();
}

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (rateLimit(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')) {
    res.status(429).json({ error: 'Too many requests' });
    return;
  }

  const payload = requireAuth(req, res);
  if (!payload) return;

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { action, data } = req.body;

    if (!action) {
      res.status(400).json({ error: 'Missing action' });
      return;
    }

    switch (action) {
      case 'create-order': {
        const {
          order_id, order_date, pickup_location,
          billing_customer_name, billing_last_name,
          billing_address, billing_address_2,
          billing_city, billing_pincode, billing_state, billing_country,
          billing_email, billing_phone,
          order_items, payment_method, sub_total,
          length, breadth, height, weight,
        } = data;

        if (!order_id || !pickup_location || !billing_customer_name || !billing_pincode || !order_items) {
          res.status(400).json({ error: 'Missing required fields' });
          return;
        }

        const result = await shiprocketFetch('/orders/create/adhoc', {
          method: 'POST',
          body: JSON.stringify({
            order_id,
            order_date: order_date || new Date().toISOString(),
            pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || pickup_location,
            channel_id: '',
            billing_customer_name,
            billing_last_name: billing_last_name || billing_customer_name.split(' ').pop(),
            billing_address: billing_address || billing_customer_name,
            billing_address_2: billing_address_2 || '',
            billing_city: billing_city || '',
            billing_pincode: billing_pincode,
            billing_state: billing_state || '',
            billing_country: billing_country || 'India',
            billing_email: billing_email || '',
            billing_phone: billing_phone || '',
            shipping_is_billing: true,
            order_items: order_items.map((item) => ({
              name: item.name,
              sku: item.sku,
              units: item.units,
              selling_price: item.selling_price,
            })),
            payment_method: payment_method || 'Prepaid',
            sub_total: sub_total || order_items.reduce((sum, i) => sum + i.selling_price * i.units, 0),
            length: length || 10,
            breadth: breadth || 10,
            height: height || 10,
            weight: weight || 0.5,
          }),
        });

        res.status(200).json(result);
        break;
      }

      case 'generate-awb': {
        const { shipment_id } = data;
        if (!shipment_id) {
          res.status(400).json({ error: 'Missing shipment_id' });
          return;
        }

        const result = await shiprocketFetch('/courier/assign/awb', {
          method: 'POST',
          body: JSON.stringify({ shipment_id }),
        });
        res.status(200).json(result);
        break;
      }

      case 'request-pickup': {
        const { shipment_id } = data;
        if (!shipment_id) {
          res.status(400).json({ error: 'Missing shipment_id' });
          return;
        }

        const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION;
        const result = await shiprocketFetch('/courier/generate/pickup', {
          method: 'POST',
          body: JSON.stringify({
            shipment_id: [shipment_id],
            pickup_location: pickupLocation || 'Primary',
          }),
        });
        res.status(200).json(result);
        break;
      }

      case 'track': {
        const { awb_code } = data;
        if (!awb_code) {
          res.status(400).json({ error: 'Missing awb_code' });
          return;
        }

        const result = await shiprocketFetch(`/courier/track/awb/${awb_code}`);
        res.status(200).json(result);
        break;
      }

      case 'cancel': {
        const { ids } = data;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
          res.status(400).json({ error: 'Missing ids array (order_id)' });
          return;
        }

        const result = await shiprocketFetch('/orders/cancel', {
          method: 'POST',
          body: JSON.stringify({ ids: ids.map(Number) }),
        });
        res.status(200).json(result);
        break;
      }

      case 'generate-label': {
        const { shipment_id } = data;
        if (!shipment_id) {
          res.status(400).json({ error: 'Missing shipment_id' });
          return;
        }

        const result = await shiprocketFetch('/courier/generate/label', {
          method: 'POST',
          body: JSON.stringify({ shipment_id: [shipment_id] }),
        });
        res.status(200).json(result);
        break;
      }

      default:
        res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (error) {
    console.error('Shiprocket API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
