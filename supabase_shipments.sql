create table public.shipments (
  id text primary key,
  order_id text not null,
  order_number text not null,
  shipment_id text not null,
  sr_order_id bigint not null,
  awb_code text,
  courier_name text,
  courier_id bigint,
  status text not null default 'NEW',
  label_url text,
  manifest_url text,
  pickup_token_number text,
  pickup_scheduled_date text,
  customer_name text not null,
  customer_phone text,
  destination_city text,
  destination_state text,
  payment_method text,
  total numeric,
  items jsonb not null,
  tracking_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.shipments enable row level security;

create policy "Admins can view all shipments"
  on shipments for select
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

create policy "Admins can insert shipments"
  on shipments for insert
  with check ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

create policy "Admins can update shipments"
  on shipments for update
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

create policy "Admins can delete shipments"
  on shipments for delete
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

create index idx_shipments_order_id on public.shipments(order_id);
create index idx_shipments_shipment_id on public.shipments(shipment_id);
create index idx_shipments_awb_code on public.shipments(awb_code);
