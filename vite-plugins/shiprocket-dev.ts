import type { Plugin } from 'vite';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const SHIPROCKET_BASE = 'https://apiv2.shiprocket.in/v1/external';

let cachedToken: string | null = null;
let tokenExpiry = 0;

function parseEnvFile(filePath: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!existsSync(filePath)) return result;

  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.substring(0, eqIdx).trim();
    const value = trimmed.substring(eqIdx + 1).trim();
    result[key] = value;
  }
  return result;
}

function getEnv(key: string, processEnv: Record<string, string | undefined>): string {
  if (processEnv[key]) return processEnv[key]!;

  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const path = join(process.cwd(), file);
    if (existsSync(path)) {
      const parsed = parseEnvFile(path);
      if (parsed[key]) return parsed[key];
    }
  }

  return '';
}

async function getAuthToken(processEnv: Record<string, string | undefined>): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const email = getEnv('SHIPROCKET_EMAIL', processEnv);
  const password = getEnv('SHIPROCKET_PASSWORD', processEnv);

  if (!email || !password) {
    throw new Error('Shiprocket credentials not configured. Set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in .env.local');
  }

  const response = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json() as { token?: string; message?: string };
  if (!data.token) {
    throw new Error(data.message || 'Shiprocket authentication failed');
  }

  cachedToken = data.token;
  tokenExpiry = Date.now() + 5 * 60 * 1000;
  return data.token;
}

async function shiprocketFetch(path: string, options: RequestInit, processEnv: Record<string, string | undefined>) {
  const token = await getAuthToken(processEnv);
  return fetch(`${SHIPROCKET_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers as Record<string, string> || {}),
    },
  });
}

export function shiprocketDevMiddleware(): Plugin {
  return {
    name: 'shiprocket-dev-middleware',
    configureServer(server) {
      const processEnv = process.env as Record<string, string | undefined>;

      server.middlewares.use('/api/shiprocket', async (req, res) => {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
        res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => { chunks.push(chunk); });
        req.on('end', async () => {
          try {
            const body = Buffer.concat(chunks).toString();
            const { action, data } = JSON.parse(body);

            if (!action) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing action' }));
              return;
            }

            let result: any;

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
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Missing required fields' }));
                  return;
                }

                const srResponse = await shiprocketFetch('/orders/create/adhoc', {
                  method: 'POST',
                  body: JSON.stringify({
                    order_id,
                    order_date: order_date || new Date().toISOString(),
                    pickup_location: getEnv('SHIPROCKET_PICKUP_LOCATION', processEnv) || pickup_location,
                    channel_id: '',
                    billing_customer_name,
                    billing_last_name: billing_last_name || billing_customer_name.split(' ').pop(),
                    billing_address: billing_address || billing_customer_name,
                    billing_address_2: billing_address_2 || '',
                    billing_city: billing_city || '',
                    billing_pincode,
                    billing_state: billing_state || '',
                    billing_country: billing_country || 'India',
                    billing_email: billing_email || '',
                    billing_phone: billing_phone || '',
                    shipping_is_billing: true,
                    order_items: order_items.map((item: any) => ({
                      name: item.name,
                      sku: item.sku,
                      units: item.units,
                      selling_price: item.selling_price,
                    })),
                    payment_method: payment_method || 'Prepaid',
                    sub_total: sub_total || order_items.reduce((sum: number, i: any) => sum + i.selling_price * i.units, 0),
                    length: length || 10,
                    breadth: breadth || 10,
                    height: height || 10,
                    weight: weight || 0.5,
                  }),
                }, processEnv);

                result = await srResponse.json();
                console.log('[shiprocket-dev] create-order result:', JSON.stringify(result).substring(0, 200));
                break;
              }

              case 'generate-awb': {
                const { shipment_id } = data;
                if (!shipment_id) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Missing shipment_id' }));
                  return;
                }

                const srResponse = await shiprocketFetch('/courier/assign/awb', {
                  method: 'POST',
                  body: JSON.stringify({ shipment_id }),
                }, processEnv);

                result = await srResponse.json();
                console.log('[shiprocket-dev] generate-awb result:', JSON.stringify(result).substring(0, 200));
                break;
              }

              case 'request-pickup': {
                const { shipment_id } = data;
                if (!shipment_id) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Missing shipment_id' }));
                  return;
                }

                const pickupLocation = getEnv('SHIPROCKET_PICKUP_LOCATION', processEnv);
                const srResponse = await shiprocketFetch('/courier/generate/pickup', {
                  method: 'POST',
                  body: JSON.stringify({
                    shipment_id: [shipment_id],
                    pickup_location: pickupLocation || 'Primary',
                  }),
                }, processEnv);

                result = await srResponse.json();
                console.log('[shiprocket-dev] request-pickup result:', JSON.stringify(result).substring(0, 200));
                break;
              }

              case 'track': {
                const { awb_code } = data;
                if (!awb_code) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Missing awb_code' }));
                  return;
                }

                const srResponse = await shiprocketFetch(`/courier/track/awb/${awb_code}`, {}, processEnv);

                result = await srResponse.json();
                console.log('[shiprocket-dev] track result:', JSON.stringify(result).substring(0, 200));
                break;
              }

              case 'cancel': {
                const { ids } = data;
                if (!ids || !Array.isArray(ids) || ids.length === 0) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Missing ids array (order_id)' }));
                  return;
                }

                const srResponse = await shiprocketFetch('/orders/cancel', {
                  method: 'POST',
                  body: JSON.stringify({ ids: ids.map(Number) }),
                }, processEnv);

                result = await srResponse.json();
                console.log('[shiprocket-dev] cancel result:', JSON.stringify(result).substring(0, 200));
                break;
              }

              case 'generate-label': {
                const { shipment_id } = data;
                if (!shipment_id) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Missing shipment_id' }));
                  return;
                }

                const srResponse = await shiprocketFetch('/courier/generate/label', {
                  method: 'POST',
                  body: JSON.stringify({ shipment_id: [shipment_id] }),
                }, processEnv);

                result = await srResponse.json();
                console.log('[shiprocket-dev] generate-label result:', JSON.stringify(result).substring(0, 200));
                break;
              }

              default:
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: `Unknown action: ${action}` }));
                return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
          } catch (err: any) {
            console.error('[shiprocket-dev] Error:', err.message);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    },
  };
}
