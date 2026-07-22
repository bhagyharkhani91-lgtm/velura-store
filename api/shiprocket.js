const SHIPROCKET_BASE = 'https://apiv2.shiprocket.in/v1/external';
const FETCH_TIMEOUT_MS = 12000;

let cachedToken = null;
let tokenExpiry = 0;

function fetchWithTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

async function getAuthToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    console.log('[shiprocket] Using cached auth token');
    return cachedToken;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error('Shiprocket credentials not configured');
  }

  console.log('[shiprocket] Authenticating with Shiprocket...');
  const response = await fetchWithTimeout(`${SHIPROCKET_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!data.token) {
    console.error('[shiprocket] Auth failed:', JSON.stringify(data));
    throw new Error(data.message || 'Shiprocket authentication failed');
  }

  console.log('[shiprocket] Auth successful');
  cachedToken = data.token;
  tokenExpiry = Date.now() + 5 * 60 * 1000;
  return data.token;
}

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
}

async function requireAdminAuth(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  try {
    const token = authHeader.split(' ')[1];
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
    const userId = payload.sub;
    if (!userId) {
      res.status(401).json({ error: 'Invalid token: missing user id' });
      return false;
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      res.status(500).json({ error: 'Supabase not configured on server' });
      return false;
    }

    const profileRes = await fetchWithTimeout(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=role`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      },
    );

    const profiles = await profileRes.json();
    const role = Array.isArray(profiles) && profiles.length > 0 ? profiles[0].role : null;

    if (role !== 'admin') {
      res.status(403).json({ error: 'Forbidden: Admin access required' });
      return false;
    }
    return true;
  } catch {
    res.status(401).json({ error: 'Invalid token' });
    return false;
  }
}

export default async function handler(req, res) {
  setCORS(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    body = req.body;
  }

  const { action, data } = body || {};

  console.log('[shiprocket] Request received:', { action });

  if (!action) {
    res.status(400).json({ error: 'Missing action' });
    return;
  }

  try {
    if (action === 'check-serviceability') {
      const { delivery_postcode, weight, cod } = data || {};
      if (!delivery_postcode) {
        res.status(400).json({ error: 'Missing delivery_postcode' });
        return;
      }

      const pickupPostcode = process.env.SHIPROCKET_PICKUP_PINCODE;
      if (!pickupPostcode) {
        res.status(400).json({ error: 'Pincode not configured on server' });
        return;
      }

      console.log('[shiprocket] check-serviceability:', { delivery_postcode, weight, cod, pickupPostcode });
      const token = await getAuthToken();
      const params = new URLSearchParams({
        pickup_postcode: pickupPostcode,
        delivery_postcode,
        weight: String(weight || 0.5),
        cod: String(cod || 0),
      });
      const url = `${SHIPROCKET_BASE}/courier/serviceability/?${params.toString()}`;

      console.log('[shiprocket] Fetching serviceability...');
      const srRes = await fetchWithTimeout(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const srData = await srRes.json();
      console.log('[shiprocket] Serviceability response status:', srData.status, 'couriers:', srData.data?.available_courier_companies?.length);
      res.status(200).json(srData);
      return;
    }

    if (!(await requireAdminAuth(req, res))) return;

    switch (action) {
      case 'create-order': {
        const result = await apiPost('/orders/create/adhoc', {
          order_id: data.order_id,
          order_date: data.order_date || new Date().toISOString(),
          pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || data.pickup_location,
          channel_id: '',
          billing_customer_name: data.billing_customer_name,
          billing_last_name: data.billing_last_name || data.billing_customer_name.split(' ').pop(),
          billing_address: data.billing_address || data.billing_customer_name,
          billing_address_2: data.billing_address_2 || '',
          billing_city: data.billing_city || '',
          billing_pincode: data.billing_pincode,
          billing_state: data.billing_state || '',
          billing_country: data.billing_country || 'India',
          billing_email: data.billing_email || '',
          billing_phone: data.billing_phone || '',
          shipping_is_billing: true,
          order_items: (data.order_items || []).map((item) => ({
            name: item.name,
            sku: item.sku,
            units: item.units,
            selling_price: item.selling_price,
          })),
          payment_method: data.payment_method || 'Prepaid',
          sub_total: data.sub_total || (data.order_items || []).reduce((sum, i) => sum + i.selling_price * i.units, 0),
          length: data.length || 10,
          breadth: data.breadth || 10,
          height: data.height || 10,
          weight: data.weight || 0.5,
        });
        res.status(200).json(result);
        break;
      }

      case 'generate-awb': {
        const result = await apiPost('/courier/assign/awb', { shipment_id: data.shipment_id });
        res.status(200).json(result);
        break;
      }

      case 'request-pickup': {
        const result = await apiPost('/courier/generate/pickup', {
          shipment_id: [data.shipment_id],
          pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
        });
        res.status(200).json(result);
        break;
      }

      case 'track': {
        const token = await getAuthToken();
        const srRes = await fetchWithTimeout(`${SHIPROCKET_BASE}/courier/track/awb/${data.awb_code}`, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        res.status(200).json(await srRes.json());
        break;
      }

      case 'cancel': {
        const result = await apiPost('/orders/cancel', { ids: (data.ids || []).map(Number) });
        res.status(200).json(result);
        break;
      }

      case 'generate-label': {
        const result = await apiPost('/courier/generate/label', { shipment_id: [data.shipment_id] });
        res.status(200).json(result);
        break;
      }

      default:
        res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (error) {
    console.error('[shiprocket] Error:', error.message, error.cause || '');
    if (error.name === 'AbortError') {
      res.status(504).json({ error: 'Shiprocket API request timed out' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

async function apiPost(path, body) {
  const token = await getAuthToken();
  const url = `${SHIPROCKET_BASE}${path}`;
  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return response.json();
}
