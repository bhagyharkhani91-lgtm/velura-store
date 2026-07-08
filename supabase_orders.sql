-- 1. ORDERS TABLE
create table public.orders (
  id text primary key,
  order_number text,
  user_id uuid references auth.users(id),
  items jsonb not null,
  subtotal numeric not null,
  shipping jsonb not null,
  tax numeric not null,
  discount numeric not null,
  total numeric not null,
  status text not null,
  timeline jsonb not null,
  shipping_address jsonb not null,
  payment_method text not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  coupon_code text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

-- 2. POLICIES
create policy "Users can view their own orders"
  on orders for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own orders"
  on orders for insert
  with check ( auth.uid() = user_id );

create policy "Admins can view all orders"
  on orders for select
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

create policy "Admins can update orders"
  on orders for update
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );
