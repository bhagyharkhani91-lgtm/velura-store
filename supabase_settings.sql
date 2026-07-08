create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  promo_messages jsonb default '["50% DISCOUNT ON ALL PRODUCTS", "CASH ON DELIVERY AVAILABLE", "100% DISCREET PACKAGING"]'::jsonb,
  contact_title text default 'CONTACT OUR CONCIERGE',
  contact_description text default 'Have a question about our premium collections or require discreet guidance? Our dedicated wellness consultants are available to assist you.',
  contact_email text default 'support@velura.com',
  contact_phone text default '+91 9914869069',
  contact_address text default 'Velura Luxury HQ, Suite 500, Mumbai, India',
  contact_hours text default 'Mon - Sat: 10:00 AM - 8:00 PM (IST)'
);

alter table public.site_settings enable row level security;

-- Drop existing policies if any to avoid errors on re-run
drop policy if exists "Settings are viewable by everyone" on public.site_settings;
drop policy if exists "Only admins can modify settings" on public.site_settings;
drop policy if exists "Only admins can insert settings" on public.site_settings;

create policy "Settings are viewable by everyone"
  on public.site_settings for select using ( true );

create policy "Only admins can modify settings"
  on public.site_settings for update
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );
  
create policy "Only admins can insert settings"
  on public.site_settings for insert
  with check ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

insert into public.site_settings (id) values (1) on conflict (id) do nothing;
