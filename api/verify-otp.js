import { applyCors } from './security.js';

export default async function handler(req, res) {
  if (await applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Server misconfigured: missing Supabase keys' });
  }

  const { action, email, otp } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const adminHeaders = {
    'apikey': serviceRoleKey,
    'Authorization': `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };

  try {
    switch (action) {
      case 'verify': {
        if (!otp) {
          return res.status(400).json({ error: 'OTP is required' });
        }

        // Find the active OTP for this email
        const otpQueryRes = await fetch(
          `${supabaseUrl}/rest/v1/verification_otps?email=eq.${encodeURIComponent(email)}&verified=eq.false&order=created_at.desc&limit=1`,
          { headers: adminHeaders }
        );

        if (!otpQueryRes.ok) {
          return res.status(500).json({ error: 'Failed to query OTP records' });
        }

        const otpRecords = await otpQueryRes.json();
        const otpRecord = Array.isArray(otpRecords) && otpRecords.length > 0 ? otpRecords[0] : null;

        if (!otpRecord) {
          return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
        }

        // Check expiry
        if (new Date(otpRecord.expires_at) < new Date()) {
          return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        // Check max attempts (max 3)
        if (otpRecord.attempts >= 3) {
          return res.status(400).json({ error: 'Too many attempts. Please request a new OTP.' });
        }

        // Increment attempts
        const newAttempts = otpRecord.attempts + 1;
        const isMatch = otpRecord.otp === otp;

        if (!isMatch) {
          await fetch(
            `${supabaseUrl}/rest/v1/verification_otps?id=eq.${otpRecord.id}`,
            {
              method: 'PATCH',
              headers: { ...adminHeaders, 'Prefer': 'return=minimal' },
              body: JSON.stringify({ attempts: newAttempts }),
            }
          );
          const remaining = 3 - newAttempts;
          return res.status(400).json({
            error: `Invalid OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
          });
        }

        // OTP is valid — mark as verified
        await fetch(
          `${supabaseUrl}/rest/v1/verification_otps?id=eq.${otpRecord.id}`,
          {
            method: 'PATCH',
            headers: { ...adminHeaders, 'Prefer': 'return=minimal' },
            body: JSON.stringify({ verified: true, attempts: newAttempts }),
          }
        );

        // Find user by email in auth.users (must list all since admin API doesn't support email query filter)
        const allUsersRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
          method: 'GET',
          headers: adminHeaders,
        });

        if (!allUsersRes.ok) {
          return res.status(500).json({ error: 'Failed to fetch user list' });
        }

        const allUsers = await allUsersRes.json();
        const usersList = Array.isArray(allUsers?.users) ? allUsers.users 
          : Array.isArray(allUsers) ? allUsers 
          : [];
        const targetUser = usersList.find(u => u.email === email);

        if (!targetUser) {
          return res.status(404).json({ error: 'User not found' });
        }

        // CRITICAL: Call Supabase Admin API to confirm email on auth.users
        const confirmRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${targetUser.id}`, {
          method: 'PUT',
          headers: adminHeaders,
          body: JSON.stringify({ email_confirm: true }),
        });

        if (!confirmRes.ok) {
          const err = await confirmRes.json().catch(() => ({}));
          return res.status(confirmRes.status).json({ error: err.msg || err.message || 'Failed to confirm email' });
        }

        // Update profiles.email_verified = true
        await fetch(
          `${supabaseUrl}/rest/v1/profiles?id=eq.${targetUser.id}`,
          {
            method: 'PATCH',
            headers: { ...adminHeaders, 'Prefer': 'return=minimal' },
            body: JSON.stringify({ email_verified: true }),
          }
        );

        return res.status(200).json({
          success: true,
          message: 'Email verified successfully',
          user_id: targetUser.id,
        });
      }

      case 'resend': {
        // Delete old OTPs for this email
        await fetch(
          `${supabaseUrl}/rest/v1/verification_otps?email=eq.${encodeURIComponent(email)}`,
          { method: 'DELETE', headers: adminHeaders }
        );

        // Generate new OTP
        const newOtp = String(Math.floor(100000 + Math.random() * 900000));
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

        const otpRes = await fetch(`${supabaseUrl}/rest/v1/verification_otps`, {
          method: 'POST',
          headers: { ...adminHeaders, 'Prefer': 'return=minimal' },
          body: JSON.stringify({ email, otp: newOtp, expires_at: expiresAt }),
        });

        if (!otpRes.ok) {
          const err = await otpRes.json().catch(() => ({}));
          return res.status(otpRes.status).json({ error: err.message || 'Failed to store OTP' });
        }

        // Send OTP email
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
                subject: 'Your New Verification Code',
                html: buildOtpEmail(newOtp),
              }),
            });
          } catch (emailErr) {
            console.error('Failed to send OTP email:', emailErr);
          }
        }

        return res.status(200).json({ success: true, message: 'New OTP sent to your email' });
      }

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (err) {
    console.error('verify-otp error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

function buildOtpEmail(otp) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #1a1a1a; margin: 0 0 16px;">Your Verification Code</h2>
      <p style="color: #555; line-height: 1.6;">Use the code below to verify your email. This code expires in 10 minutes.</p>
      <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 24px 0; border-radius: 8px;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">${otp}</span>
      </div>
      <p style="color: #888; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
}
