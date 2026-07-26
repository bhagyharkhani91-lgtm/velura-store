import type { Plugin } from 'vite';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

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

export function signupWithVerifyDevMiddleware(): Plugin {
  return {
    name: 'signup-with-verify-dev-middleware',
    configureServer(server) {
      const processEnv = process.env as Record<string, string | undefined>;

      server.middlewares.use('/api/signup-with-verify', async (req, res) => {
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

        const supabaseUrl = getEnv('VITE_SUPABASE_URL', processEnv);
        const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY', processEnv);
        const resendApiKey = getEnv('RESEND_API_KEY', processEnv);

        if (!supabaseUrl || !serviceRoleKey) {
          console.error('[signup-dev] Missing SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_URL');
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
            const { email, password, name, phone, date_of_birth } = body;

            if (!email || !password || !name) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing required fields: email, password, name' }));
              return;
            }

            const adminHeaders: Record<string, string> = {
              'apikey': serviceRoleKey,
              'Authorization': `Bearer ${serviceRoleKey}`,
              'Content-Type': 'application/json',
            };

            // Check existing user
            const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
              method: 'GET',
              headers: adminHeaders,
            });

            if (!listRes.ok) {
              const err = await listRes.json().catch(() => ({})) as any;
              res.statusCode = listRes.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.error_description || err.message || 'Failed to check existing users' }));
              return;
            }

            const allUsers = await listRes.json() as any;
            const usersList = Array.isArray(allUsers?.users) ? allUsers.users
              : Array.isArray(allUsers) ? allUsers
              : [];
            const existingUser = usersList.find((u: any) => u.email === email);

            if (existingUser) {
              const profileRes = await fetch(
                `${supabaseUrl}/rest/v1/profiles?id=eq.${existingUser.id}&select=role,email_verified`,
                { headers: adminHeaders }
              );
              const profiles = await profileRes.json().catch(() => []) as any[];
              const profile = Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : null;

              if (profile?.role === 'admin') {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Cannot re-register admin account' }));
                return;
              }

              if (existingUser.email_confirmed_at) {
                res.statusCode = 409;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Account already exists. Please login instead.' }));
                return;
              }

              // Delete unverified user
              await fetch(`${supabaseUrl}/auth/v1/admin/users/${existingUser.id}`, {
                method: 'DELETE',
                headers: adminHeaders,
              });

              // Delete old OTPs
              await fetch(
                `${supabaseUrl}/rest/v1/verification_otps?email=eq.${encodeURIComponent(email)}`,
                { method: 'DELETE', headers: adminHeaders }
              );
            }

            // Create user
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
              const err = await createRes.json().catch(() => ({})) as any;
              res.statusCode = createRes.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.msg || err.message || 'Failed to create user' }));
              return;
            }

            const newUser = await createRes.json() as any;

            // Update profile extra fields
            await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${newUser.id}`, {
              method: 'PATCH',
              headers: { ...adminHeaders, 'Prefer': 'return=minimal' },
              body: JSON.stringify({
                phone: phone || null,
                date_of_birth: date_of_birth || null,
                email_verified: false,
              }),
            });

            // Delete old OTPs
            await fetch(
              `${supabaseUrl}/rest/v1/verification_otps?email=eq.${encodeURIComponent(email)}`,
              { method: 'DELETE', headers: adminHeaders }
            );

            // Generate and store OTP
            const otp = String(Math.floor(100000 + Math.random() * 900000));
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

            const otpRes = await fetch(`${supabaseUrl}/rest/v1/verification_otps`, {
              method: 'POST',
              headers: { ...adminHeaders, 'Prefer': 'return=minimal' },
              body: JSON.stringify({ email, otp, expires_at: expiresAt }),
            });

            if (!otpRes.ok) {
              const err = await otpRes.json().catch(() => ({})) as any;
              res.statusCode = otpRes.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Failed to store OTP' }));
              return;
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
                    subject: 'Your Verification Code',
                    html: buildOtpEmail(otp, name),
                  }),
                });
              } catch (e) {
                console.error('[signup-dev] Email send failed:', e);
              }
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: 'OTP sent to your email' }));
          } catch (err: any) {
            console.error('[signup-dev] Error:', err.message);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    },
  };
}

function buildOtpEmail(otp: string, name?: string): string {
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
