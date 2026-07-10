import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf-8') + '\n' + fs.readFileSync('.env', 'utf-8');
let supabaseUrl = '';
let supabaseKey = '';
for (const line of env.split('\n')) {
  if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1];
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1];
}

const supabase = createClient(supabaseUrl, supabaseKey);
supabase.from('orders').select('payment_status').limit(1).then(console.log);
