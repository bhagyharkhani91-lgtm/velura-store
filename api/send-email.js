export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Verify Authentication (Basic JWT check for Supabase)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }
    
    // In a full production app, you would verify this JWT using jsonwebtoken and your Supabase JWT secret.
    // For this implementation, we ensure the token is present to block unauthenticated access.
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 2. Validate Env Vars
    const resendApiKey = process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error('Server configuration error: Missing email gateway keys.');
    }

    const { to, subject, html } = req.body;
    
    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required email fields (to, subject, html)' });
    }

    // 3. Send via Resend API
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: 'Adult Store <support@adult-store.in>',
        to: [to],
        subject: subject,
        html: html
      })
    });

    const data = await resendRes.json();

    if (!resendRes.ok) {
      // If Resend fails (e.g. Sandbox limits), we throw the error so the client can handle it
      throw new Error(data.message || data.error?.message || 'Failed to send email via Resend');
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Vercel Email API Error:", error);
    res.status(500).json({ error: error.message });
  }
}
