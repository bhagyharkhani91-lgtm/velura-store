export default async function handler(req, res) {
  // Add CORS headers for testing
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { amount, receipt, items } = req.body;

    if (typeof amount !== 'number' || amount <= 0 || !Number.isFinite(amount)) {
      return res.status(400).json({ error: 'Invalid amount.' });
    }

    if (!receipt || typeof receipt !== 'string' || !/^ORD-\d+$/.test(receipt)) {
      return res.status(400).json({ error: 'Invalid receipt.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing items.' });
    }

    let expectedTotal = 0;
    for (const item of items) {
      if (typeof item.price !== 'number' || item.price < 0) {
        return res.status(400).json({ error: 'Invalid item price.' });
      }
      if (typeof item.quantity !== 'number' || item.quantity < 1 || !Number.isInteger(item.quantity)) {
        return res.status(400).json({ error: 'Invalid item quantity.' });
      }
      const itemShipping = typeof item.shippingCharge === 'number' && item.shippingCharge >= 0
        ? item.shippingCharge
        : 0;
      expectedTotal += item.price * item.quantity + itemShipping * item.quantity;
    }

    if (Math.abs(expectedTotal - amount) > 1) {
      return res.status(400).json({ error: 'Amount mismatch.' });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error('Server configuration error: Missing payment gateway keys.');
    }

    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${basicAuth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: receipt
      })
    });

    const orderData = await razorpayRes.json();

    if (!razorpayRes.ok) {
      throw new Error(orderData.error?.description || 'Unknown Razorpay error');
    }

    res.status(200).json(orderData);
  } catch (error) {
    console.error("Vercel API Error:", error);
    res.status(400).json({ error: error.message });
  }
}
