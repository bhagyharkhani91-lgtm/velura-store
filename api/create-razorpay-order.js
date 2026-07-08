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
    const { amount, receipt } = req.body;
    
    // In Vercel, we will read these from process.env instead of hardcoding
    // But we fall back to the test keys if not provided, to ensure it works instantly
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_TAzZYC15Rkxqdh';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'SBpkVPM74j64SmISy8BHQeMw';

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
        receipt: receipt || `receipt_${Date.now()}`
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
