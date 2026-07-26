/**
 * One-time cleanup script for dangling auth.users accounts.
 *
 * After migration, some users may exist in auth.users but have no profiles row.
 * This script:
 * 1. Lists all auth.users, lists all profiles
 * 2. Finds users in auth but not in profiles
 * 3. Checks orders table for real orders — creates profiles for those (FK constraints)
 * 4. Deletes the rest (dangling junk accounts with no orders)
 *
 * Usage:
 *   node scripts/cleanup-dangling-users.js
 *
 * Requires env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const adminHeaders = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
};

async function main() {
  console.log('Fetching all auth.users...');
  const usersRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'GET',
    headers: adminHeaders,
  });
  const usersData = await usersRes.json();
  const authUsers = Array.isArray(usersData?.users) ? usersData.users
    : Array.isArray(usersData) ? usersData
    : [];
  console.log(`Found ${authUsers.length} auth.users`);

  console.log('Fetching all profiles...');
  const profilesRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id`, {
    headers: adminHeaders,
  });
  const profiles = await profilesRes.json();
  const profileIds = new Set((profiles || []).map((p) => p.id));
  console.log(`Found ${profileIds.size} profiles`);

  const dangling = authUsers.filter((u) => !profileIds.has(u.id));
  console.log(`Found ${dangling.length} dangling auth.users (no profile)`);

  if (dangling.length === 0) {
    console.log('Nothing to clean up.');
    return;
  }

  let created = 0;
  let deleted = 0;

  for (const user of dangling) {
    // Check for real orders
    const ordersRes = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?user_id=eq.${user.id}&limit=1`,
      { headers: adminHeaders }
    );
    const orders = await ordersRes.json().catch(() => []);
    const hasOrders = Array.isArray(orders) && orders.length > 0;

    if (hasOrders) {
      console.log(`  Creating profile for ${user.email} (has orders, cannot delete due to FK)`);
      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
        method: 'POST',
        headers: { ...adminHeaders, 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          role: 'customer',
          email_verified: !!user.email_confirmed_at,
        }),
      });
      if (insertRes.ok) created++;
      else console.error(`    Failed:`, await insertRes.text());
    } else {
      console.log(`  Deleting dangling user ${user.email}`);
      const delRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: adminHeaders,
      });
      if (delRes.ok) deleted++;
      else console.error(`    Failed:`, await delRes.text());
    }
  }

  console.log(`\nDone. Created ${created} profiles, deleted ${deleted} dangling users.`);
}

main().catch(console.error);
