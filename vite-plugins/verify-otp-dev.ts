import type { Plugin } from 'vite';

export function verifyOtpDevMiddleware(): Plugin {
  return {
    name: 'verify-otp-dev-middleware',
    configureServer(server) {
      const loadEnv = (key: string): string | undefined => {
        return process.env[key] || undefined;
      };

      server.middlewares.use('/api/verify-otp', async (req, res) => {
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

        const supabaseUrl = loadEnv('VITE_SUPABASE_URL');
        const serviceRoleKey = loadEnv('SUPABASE_SERVICE_ROLE_KEY');
        const resendApiKey = loadEnv('RESEND_API_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Server misconfigured: missing Supabase keys' }));
          return;
        }

        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => { chunks.push(chunk); });
        req.on('end', async () => {
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString());
            const { action, email, otp } = body;

            if (!email) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Email is required' }));
              return;
            }

            const adminHeaders: Record<string, string> = {
              'apikey': serviceRoleKey,
              'Authorization': `Bearer ${serviceRoleKey}`,
              'Content-Type': 'application/json',
            };

            if (action === 'verify') {
              if (!otp) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'OTP is required' }));
                return;
              }

              const otpQueryRes = await fetch(
                `${supabaseUrl}/rest/v1/verification_otps?email=eq.${encodeURIComponent(email)}&verified=eq.false&order=created_at.desc&limit=1`,
                { headers: adminHeaders }
              );
              const otpRecords = await otpQueryRes.json() as any[];
              const otpRecord = Array.isArray(otpRecords) && otpRecords.length > 0 ? otpRecords[0] : null;

              if (!otpRecord) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'No OTP found. Please request a new one.' }));
                return;
              }

              if (new Date(otpRecord.expires_at) < new Date()) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'OTP has expired. Please request a new one.' }));
                return;
              }

              if (otpRecord.attempts >= 3) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Too many attempts. Please request a new OTP.' }));
                return;
              }

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
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: `Invalid OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.` }));
                return;
              }

              // Mark OTP verified
              await fetch(
                `${supabaseUrl}/rest/v1/verification_otps?id=eq.${otpRecord.id}`,
                {
                  method: 'PATCH',
                  headers: { ...adminHeaders, 'Prefer': 'return=minimal' },
                  body: JSON.stringify({ verified: true, attempts: newAttempts }),
                }
              );

              // Find user by email
              const allUsersRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
                method: 'GET',
                headers: adminHeaders,
              });
              const allUsers = await allUsersRes.json() as any;
              const usersList = Array.isArray(allUsers?.users) ? allUsers.users
                : Array.isArray(allUsers) ? allUsers
                : [];
              const targetUser = usersList.find((u: any) => u.email === email);

              if (!targetUser) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'User not found' }));
                return;
              }

              // Confirm email on auth.users
              const confirmRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${targetUser.id}`, {
                method: 'PUT',
                headers: adminHeaders,
                body: JSON.stringify({ email_confirm: true }),
              });

              if (!confirmRes.ok) {
                const err = await confirmRes.json().catch(() => ({})) as any;
                res.statusCode = confirmRes.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.msg || err.message || 'Failed to confirm email' }));
                return;
              }

              // Update profile
              await fetch(
                `${supabaseUrl}/rest/v1/profiles?id=eq.${targetUser.id}`,
                {
                  method: 'PATCH',
                  headers: { ...adminHeaders, 'Prefer': 'return=minimal' },
                  body: JSON.stringify({ email_verified: true }),
                }
              );

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: 'Email verified successfully',
                user_id: targetUser.id,
              }));
              return;
            }

            if (action === 'resend') {
              // Delete old OTPs
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
                const err = await otpRes.json().catch(() => ({})) as any;
                res.statusCode = otpRes.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Failed to store OTP' }));
                return;
              }

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
                } catch (e) {
                  console.error('[verify-otp-dev] Email send failed:', e);
                }
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'New OTP sent to your email' }));
              return;
            }

            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `Unknown action: ${action}` }));
          } catch (err: any) {
            console.error('[verify-otp-dev] Error:', err.message);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    },
  };
}

function buildOtpEmail(otp: string): string {
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
