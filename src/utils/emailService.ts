import { formatPrice } from './index';
import { supabase } from '../lib/supabase';

function resolveImageUrl(url: string): string {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const origin =
    (typeof window !== 'undefined' && window.location?.origin) ||
    (import.meta.env.VITE_SITE_URL as string | undefined) ||
    'https://adult-store.in';
  return url.startsWith('/') ? `${origin}${url}` : `${origin}/${url}`;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ShipmentData {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  shippingAddress: ShippingInfo;
}

async function sendEmail(to: string, subject: string, html: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    console.log('[sendEmail] Sending to:', to, 'subject:', subject);

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from: 'Adult Store <support@adult-store.in>',
        to: [to],
        subject,
        html,
      }),
    });

    const contentType = response.headers.get('content-type') || '';
    const responseText = await response.text();

    if (!contentType.includes('application/json') || !response.ok) {
      console.error('[sendEmail] Server responded with status:', response.status, 'body:', responseText.substring(0, 200));
      return { success: false, error: responseText };
    }

    const data = JSON.parse(responseText);
    console.log('[sendEmail] Success:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('[sendEmail] Error:', error.message);
    return { success: false, error: error.message };
  }
}

interface OrderData {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: { cost: number; method: string; estimatedDays: string };
  total: number;
  shippingAddress: ShippingInfo;
}

/**
 * Sends a premium order confirmation email via the Resend API proxy.
 */
export async function sendOrderConfirmationEmail(order: OrderData) {
  const { id, items, subtotal, shipping, total, shippingAddress } = order;

  // Format order items table rows
  const itemsHtml = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #eaeaea;">
        <td style="padding: 16px 0; vertical-align: top;">
          <table border="0" cellspacing="0" cellpadding="0" style="width: 100%;">
            <tr>
              <td style="width: 60px; vertical-align: top;">
                <img src="${resolveImageUrl(item.image)}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #eaeaea;" />
              </td>
              <td style="padding-left: 12px; vertical-align: top;">
                <div style="font-weight: 600; color: #111111; font-size: 14px; margin-bottom: 2px;">${item.name}</div>
                ${item.variant ? `<div style="color: #777777; font-size: 12px; margin-bottom: 2px;">Variant: ${item.variant}</div>` : ''}
                <div style="color: #999999; font-size: 12px;">Qty: ${item.quantity}</div>
              </td>
            </tr>
          </table>
        </td>
        <td style="padding: 16px 0; text-align: right; vertical-align: middle; font-weight: 600; color: #111111; font-size: 14px;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('');

  // Premium, luxury email template matching the Adult Store storefront
  const htmlContent = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Order Confirmation - Adult Store</title>
        <style type="text/css">
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #fafafa;
            color: #333333;
            -webkit-font-smoothing: antialiased;
          }
          a {
            color: #bfa17a;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          @media only screen and (max-width: 600px) {
            .container {
              width: 100% !important;
              padding: 10px !important;
            }
            .content-padding {
              padding: 24px 16px !important;
            }
            .col {
              display: block !important;
              width: 100% !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
              margin-bottom: 24px !important;
            }
            .col-last {
              margin-bottom: 0 !important;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fafafa;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fafafa; padding: 40px 0;">
          <tr>
            <td align="center">
              <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e8e8e8; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                <!-- Brand Header -->
                <tr>
                  <td align="center" style="background-color: #0d0d0d; padding: 32px 20px; border-bottom: 3px solid #bfa17a;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 6px; font-weight: 300; text-transform: uppercase;">Adult Store</h1>
                  </td>
                </tr>
                
                <!-- Email Body -->
                <tr>
                  <td class="content-padding" style="padding: 40px 40px;">
                    <h2 style="color: #111111; font-size: 20px; font-weight: 600; margin-top: 0; margin-bottom: 12px; letter-spacing: -0.5px;">Your Order is Confirmed</h2>
                    <p style="color: #555555; font-size: 15px; line-height: 24px; margin-top: 0; margin-bottom: 24px;">
                      Thank you for your purchase, ${shippingAddress.firstName}. We are preparing your order <strong>#${id}</strong> for dispatch. 
                      You will receive delivery information as soon as it is shipped.
                    </p>
                    
                    <!-- Discretion Notice -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f5f2; border-left: 4px solid #bfa17a; margin-bottom: 32px;">
                      <tr>
                        <td style="padding: 16px;">
                          <h4 style="color: #bfa17a; margin: 0 0 6px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Discreet Delivery Guarantee</h4>
                          <p style="color: #6e655b; font-size: 12.5px; line-height: 18px; margin: 0;">
                            To safeguard your privacy, your order will be delivered in standard, completely plain and unmarked packaging. 
                            The sender's name and billing descriptor will show a discreet corporate name, with absolutely no mention of "Adult Store" or your package contents.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Items Header -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-bottom: 1px solid #111111; padding-bottom: 8px; margin-bottom: 8px;">
                      <tr>
                        <td>
                          <span style="color: #111111; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Items Ordered</span>
                        </td>
                        <td align="right">
                          <span style="color: #111111; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Total</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Items Table -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                      ${itemsHtml}
                    </table>

                    <!-- Totals Table -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px; border-top: 1px solid #eaeaea; padding-top: 8px;">
                      <tr>
                        <td style="padding: 6px 0; color: #666666; font-size: 14px;">Subtotal</td>
                        <td align="right" style="padding: 6px 0; color: #111111; font-size: 14px; font-weight: 500;">${formatPrice(subtotal)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #666666; font-size: 14px;">Shipping (${shipping.method})</td>
                        <td align="right" style="padding: 6px 0; color: #111111; font-size: 14px; font-weight: 500;">${formatPrice(shipping.cost)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0 0 0; color: #111111; font-size: 16px; font-weight: 700; border-top: 1px solid #111111; margin-top: 8px;">Total Paid</td>
                        <td align="right" style="padding: 12px 0 0 0; color: #111111; font-size: 16px; font-weight: 700; border-top: 1px solid #111111; margin-top: 8px;">${formatPrice(total)}</td>
                      </tr>
                    </table>

                    <!-- Shipping and Delivery Address -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td class="col" width="48%" style="vertical-align: top; padding-right: 12px;">
                          <h3 style="color: #111111; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 10px;">Shipping Address</h3>
                          <p style="color: #555555; font-size: 13px; line-height: 20px; margin: 0;">
                            ${shippingAddress.firstName} ${shippingAddress.lastName}<br />
                            ${shippingAddress.street}<br />
                            ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br />
                            ${shippingAddress.country}<br />
                            Phone: ${shippingAddress.phone}
                          </p>
                        </td>
                        <td class="col col-last" width="48%" style="vertical-align: top; padding-left: 12px;">
                          <h3 style="color: #111111; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 10px;">Delivery Info</h3>
                          <p style="color: #555555; font-size: 13px; line-height: 20px; margin: 0;">
                            <strong>Delivery Speed:</strong> ${shipping.estimatedDays} (${shipping.method})<br />
                            <strong>Payment Method:</strong> Cash on Delivery (COD)<br />
                            <strong>Delivery Status:</strong> Pending Dispatch
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td align="center" style="background-color: #fcfcfc; padding: 32px 24px; border-top: 1px solid #eaeaea;">
                    <p style="color: #777777; font-size: 12px; margin: 0 0 10px 0; line-height: 18px;">
                      If you have any questions or require custom requests, feel free to contact us at 
                      <a href="mailto:support@adult-store.in" style="color: #bfa17a; text-decoration: none;">support@adult-store.in</a>.
                    </p>
                    <p style="color: #aaaaaa; font-size: 11px; margin: 0; letter-spacing: 0.5px;">
                      &copy; ${new Date().getFullYear()} Adult Store. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail(shippingAddress.email, `Order Confirmation #${id} - Adult Store`, htmlContent);
}

export async function sendShipmentConfirmationEmail(order: ShipmentData) {
  const { orderNumber, items, total, shippingAddress } = order;

  let trackingHtml = '';
  try {
    const { data: shipments } = await supabase
      .from('shipments')
      .select('awb_code, courier_name')
      .eq('order_id', order.id)
      .limit(1);

    const shipment = shipments?.[0];
    if (shipment?.awb_code) {
      const trackUrl = `https://shiprocket.co/tracking/${shipment.awb_code}`;
      trackingHtml = `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f0fdf4; border-left: 4px solid #22c55e; margin-bottom: 32px;">
          <tr>
            <td style="padding: 16px;">
              <h4 style="color: #22c55e; margin: 0 0 6px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Tracking Information</h4>
              <p style="color: #166534; font-size: 12.5px; line-height: 18px; margin: 0 0 8px 0;">
                <strong>AWB:</strong> ${shipment.awb_code}<br />
                <strong>Courier:</strong> ${shipment.courier_name || 'Dispatched'}<br />
              </p>
              <a href="${trackUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #22c55e; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 4px; font-size: 12px; font-weight: 600;">Track Your Order</a>
            </td>
          </tr>
        </table>`;
    } else {
      trackingHtml = `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f5f2; border-left: 4px solid #bfa17a; margin-bottom: 32px;">
          <tr>
            <td style="padding: 16px;">
              <h4 style="color: #bfa17a; margin: 0 0 6px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Tracking</h4>
              <p style="color: #6e655b; font-size: 12.5px; line-height: 18px; margin: 0;">
                Your order is being processed. Tracking information will be available once dispatched.
              </p>
            </td>
          </tr>
        </table>`;
    }
  } catch {
    trackingHtml = `
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f5f2; border-left: 4px solid #bfa17a; margin-bottom: 32px;">
        <tr>
          <td style="padding: 16px;">
            <h4 style="color: #bfa17a; margin: 0 0 6px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Tracking</h4>
            <p style="color: #6e655b; font-size: 12.5px; line-height: 18px; margin: 0;">
              Your order is being processed. Tracking information will be available once dispatched.
            </p>
          </td>
        </tr>
      </table>`;
  }

  const itemsHtml = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #eaeaea;">
        <td style="padding: 16px 0; vertical-align: top;">
          <table border="0" cellspacing="0" cellpadding="0" style="width: 100%;">
            <tr>
              <td style="width: 60px; vertical-align: top;">
                <img src="${resolveImageUrl(item.image)}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #eaeaea;" />
              </td>
              <td style="padding-left: 12px; vertical-align: top;">
                <div style="font-weight: 600; color: #111111; font-size: 14px; margin-bottom: 2px;">${item.name}</div>
                ${item.variant ? `<div style="color: #777777; font-size: 12px; margin-bottom: 2px;">Variant: ${item.variant}</div>` : ''}
                <div style="color: #999999; font-size: 12px;">Qty: ${item.quantity}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Order Shipped - Adult Store</title>
        <style type="text/css">
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #fafafa;
            color: #333333;
            -webkit-font-smoothing: antialiased;
          }
          a {
            color: #bfa17a;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          @media only screen and (max-width: 600px) {
            .container {
              width: 100% !important;
              padding: 10px !important;
            }
            .content-padding {
              padding: 24px 16px !important;
            }
            .col {
              display: block !important;
              width: 100% !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
              margin-bottom: 24px !important;
            }
            .col-last {
              margin-bottom: 0 !important;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fafafa;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fafafa; padding: 40px 0;">
          <tr>
            <td align="center">
              <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e8e8e8; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                <tr>
                  <td align="center" style="background-color: #0d0d0d; padding: 32px 20px; border-bottom: 3px solid #bfa17a;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 6px; font-weight: 300; text-transform: uppercase;">Adult Store</h1>
                  </td>
                </tr>
                
                <tr>
                  <td class="content-padding" style="padding: 40px 40px;">
                    <h2 style="color: #111111; font-size: 20px; font-weight: 600; margin-top: 0; margin-bottom: 12px; letter-spacing: -0.5px;">Your Order Has Been Shipped!</h2>
                    <p style="color: #555555; font-size: 15px; line-height: 24px; margin-top: 0; margin-bottom: 24px;">
                      Great news, ${shippingAddress.firstName}! Your order <strong>#${orderNumber}</strong> is on its way. 
                      It has been carefully packed in discreet, unmarked packaging and handed over to our delivery partner.
                    </p>
                    
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f5f2; border-left: 4px solid #bfa17a; margin-bottom: 32px;">
                      <tr>
                        <td style="padding: 16px;">
                          <h4 style="color: #bfa17a; margin: 0 0 6px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Discreet Packaging Guarantee</h4>
                          <p style="color: #6e655b; font-size: 12.5px; line-height: 18px; margin: 0;">
                            Your package is shipped in a plain, unmarked box with no logos, brand names, or product descriptions. 
                            The sender information on the label will appear as a discreet corporate entity.
                          </p>
                        </td>
                      </tr>
                    </table>

                    ${trackingHtml}

                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                      <tr>
                        <td>
                          <span style="color: #111111; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Items in Your Shipment</span>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                      ${itemsHtml}
                    </table>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px; border-top: 1px solid #eaeaea; padding-top: 8px;">
                      <tr>
                        <td style="padding: 6px 0; color: #666666; font-size: 14px;">Order Number</td>
                        <td align="right" style="padding: 6px 0; color: #111111; font-size: 14px; font-weight: 500;">#${orderNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0 0 0; color: #111111; font-size: 16px; font-weight: 700; border-top: 1px solid #111111; margin-top: 8px;">Total Paid</td>
                        <td align="right" style="padding: 12px 0 0 0; color: #111111; font-size: 16px; font-weight: 700; border-top: 1px solid #111111; margin-top: 8px;">${formatPrice(total)}</td>
                      </tr>
                    </table>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td class="col" width="48%" style="vertical-align: top; padding-right: 12px;">
                          <h3 style="color: #111111; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 10px;">Shipping Address</h3>
                          <p style="color: #555555; font-size: 13px; line-height: 20px; margin: 0;">
                            ${shippingAddress.firstName} ${shippingAddress.lastName}<br />
                            ${shippingAddress.street}<br />
                            ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br />
                            ${shippingAddress.country}<br />
                            Phone: ${shippingAddress.phone}
                          </p>
                        </td>
                        <td class="col col-last" width="48%" style="vertical-align: top; padding-left: 12px;">
                          <h3 style="color: #111111; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 10px;">What's Next?</h3>
                          <p style="color: #555555; font-size: 13px; line-height: 20px; margin: 0;">
                            <strong>Estimated Delivery:</strong> 3–7 Business Days<br />
                            <strong>Need Help?</strong> Reach out to our concierge at support@adult-store.in
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr>
                  <td align="center" style="background-color: #fcfcfc; padding: 32px 24px; border-top: 1px solid #eaeaea;">
                    <p style="color: #777777; font-size: 12px; margin: 0 0 10px 0; line-height: 18px;">
                      If you have any questions or require custom requests, feel free to contact us at 
                      <a href="mailto:support@adult-store.in" style="color: #bfa17a; text-decoration: none;">support@adult-store.in</a>.
                    </p>
                    <p style="color: #aaaaaa; font-size: 11px; margin: 0; letter-spacing: 0.5px;">
                      &copy; ${new Date().getFullYear()} Adult Store. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail(shippingAddress.email, `Your Order #${orderNumber} Has Been Shipped! - Adult Store`, htmlContent);
}
