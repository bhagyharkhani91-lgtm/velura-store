import { applyCors, requireAuth } from './security.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const payload = requireAuth(req, res);
  if (!payload) return;

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Server misconfigured: missing Supabase keys' });
  }

  const { userId } = req.body || {};

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const adminHeaders = {
    'apikey': serviceRoleKey,
    'Authorization': `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };

  try {
    // 1. Check target user's profile — refuse to delete admins
    const profileRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=role`,
      { headers: adminHeaders }
    );

    const profiles = await profileRes.json().catch(() => []);
    const profile = Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : null;

    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (profile.role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin accounts' });
    }

    // 2. Delete from profiles first (belt), then from auth.users (suspenders — cascade handles it)
    // Delete profiles manually in case cascade was removed
    await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`,
      { method: 'DELETE', headers: adminHeaders }
    );

    // 3. Delete from auth.users
    const deleteRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
      method: 'DELETE',
      headers: adminHeaders,
    });

    if (!deleteRes.ok) {
      const err = await deleteRes.json().catch(() => ({}));
      return res.status(deleteRes.status).json({ error: err.msg || err.message || 'Failed to delete auth user' });
    }

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('delete-user error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
