import { applyCors } from './security.js';

export default async function handler(req, res) {
  if (await applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Server misconfigured: missing Supabase keys' });
  }

  const { email, password, name, phone, date_of_birth } = req.body || {};

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields: email, password, name' });
  }

  const adminHeaders = {
    'apikey': serviceRoleKey,
    'Authorization': `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };

  try {
    // 1. Check if user already exists in auth.users
    const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'GET',
      headers: adminHeaders,
    });

    if (!listRes.ok) {
      const err = await listRes.json().catch(() => ({}));
      return res.status(listRes.status).json({ error: err.error_description || err.message || 'Failed to check existing users' });
    }

    const allUsers = await listRes.json();
    const existingUser = Array.isArray(allUsers?.users) 
      ? allUsers.users.find(u => u.email === email)
      : Array.isArray(allUsers)
        ? allUsers.find(u => u.email === email)
        : null;

    if (existingUser) {
      // 2. Check profile for role
      const profileRes = await fetch(
        `${supabaseUrl}/rest/v1/profiles?id=eq.${existingUser.id}&select=role,email_verified`,
        { headers: adminHeaders }
      );
      const profiles = await profileRes.json().catch(() => []);
      const profile = Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : null;

      if (profile?.role === 'admin') {
        return res.status(403).json({ error: 'Cannot re-register admin account' });
      }

      // 3. Check if user is already verified
      if (existingUser.email_confirmed_at) {
        return res.status(409).json({ error: 'Account already exists. Please login instead.' });
      }

      // 4. Unverified user — delete old user and OTPs, then recreate
      await fetch(`${supabaseUrl}/auth/v1/admin/users/${existingUser.id}`, {
        method: 'DELETE',
        headers: adminHeaders,
      });

      // Delete old OTPs for this email
      await fetch(
        `${supabaseUrl}/rest/v1/verification_otps?email=eq.${encodeURIComponent(email)}`,
        { method: 'DELETE', headers: adminHeaders }
      );
    }

    // 5. Create user in auth.users with email_confirm: false
    const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        email,
        password,
        email_confirm: false,
        user_metadata: { name, phone: phone || '', date_of_birth: date_of_birth || '' },
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      return res.status(createRes.status).json({ error: err.msg || err.message || 'Failed to create user' });
    }

    const newUser = await createRes.json();

    // 6. Update profile with extra fields (trigger already created a basic one)
    await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${newUser.id}`, {
      method: 'PATCH',
      headers: { ...adminHeaders, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        phone: phone || null,
        date_of_birth: date_of_birth || null,
        email_verified: false,
      }),
    });

    // 7. Delete old OTPs for this email
    await fetch(
      `${supabaseUrl}/rest/v1/verification_otps?email=eq.${encodeURIComponent(email)}`,
      { method: 'DELETE', headers: adminHeaders }
    );

    // 8. Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const otpRes = await fetch(`${supabaseUrl}/rest/v1/verification_otps`, {
      method: 'POST',
      headers: { ...adminHeaders, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ email, otp, expires_at: expiresAt }),
    });

    if (!otpRes.ok) {
      const err = await otpRes.json().catch(() => ({}));
      return res.status(otpRes.status).json({ error: err.message || 'Failed to store OTP' });
    }

    // 9. Send OTP email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Adult Store <support@adult-store.in>',
            to: [email],
            subject: 'Your Verification Code',
            html: buildOtpEmail(otp, name),
          }),
        });
      } catch (emailErr) {
        console.error('Failed to send OTP email:', emailErr);
      }
    }

    return res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    console.error('signup-with-verify error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

function buildOtpEmail(otp, name) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #1a1a1a; margin: 0 0 16px;">Verify Your Email</h2>
      <p style="color: #555; line-height: 1.6;">Hi${name ? ' ' + name : ''},</p>
      <p style="color: #555; line-height: 1.6;">Use the code below to verify your email and complete registration. This code expires in 10 minutes.</p>
      <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 24px 0; border-radius: 8px;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">${otp}</span>
      </div>
      <p style="color: #888; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
}
