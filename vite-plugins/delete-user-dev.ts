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

function verifyJwt(token: string): Record<string, any> | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
    return payload;
  } catch {
    return null;
  }
}

export function deleteUserDevMiddleware(): Plugin {
  return {
    name: 'delete-user-dev-middleware',
    configureServer(server) {
      const processEnv = process.env as Record<string, string | undefined>;

      server.middlewares.use('/api/delete-user', async (req, res) => {
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

        // Verify admin JWT
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Unauthorized: Missing or invalid token' }));
          return;
        }

        const token = authHeader.split(' ')[1];
        const payload = verifyJwt(token);
        if (!payload) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Unauthorized: Invalid token' }));
          return;
        }

        const userRole = payload.user_metadata?.role || payload.app_metadata?.role;
        if (userRole !== 'admin') {
          res.statusCode = 403;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Forbidden: Admin access required' }));
          return;
        }

        const supabaseUrl = getEnv('VITE_SUPABASE_URL', processEnv);
        const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY', processEnv);

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
            const { userId } = body;

            if (!userId) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'userId is required' }));
              return;
            }

            const adminHeaders: Record<string, string> = {
              'apikey': serviceRoleKey,
              'Authorization': `Bearer ${serviceRoleKey}`,
              'Content-Type': 'application/json',
            };

            // Check target user role
            const profileRes = await fetch(
              `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=role`,
              { headers: adminHeaders }
            );
            const profiles = await profileRes.json().catch(() => []) as any[];
            const profile = Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : null;

            if (!profile) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'User not found' }));
              return;
            }

            if (profile.role === 'admin') {
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Cannot delete admin accounts' }));
              return;
            }

            // Delete from profiles
            await fetch(
              `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`,
              { method: 'DELETE', headers: adminHeaders }
            );

            // Delete from auth.users
            const deleteRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
              method: 'DELETE',
              headers: adminHeaders,
            });

            if (!deleteRes.ok) {
              const err = await deleteRes.json().catch(() => ({})) as any;
              res.statusCode = deleteRes.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.msg || err.message || 'Failed to delete auth user' }));
              return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: 'User deleted successfully' }));
          } catch (err: any) {
            console.error('[delete-user-dev] Error:', err.message);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    },
  };
}
