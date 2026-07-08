-- Drop the old products table if it exists so we can recreate it with the full schema
drop table if exists public.products cascade;

create table public.products (
  id text default gen_random_uuid()::text primary key,
  slug text unique not null,
  name text not null,
  short_description text,
  description text,
  category_id text,
  subcategory_id text,
  brand_id text,
  price numeric not null,
  compare_at_price numeric,
  images jsonb default '[]'::jsonb not null,
  variants jsonb default '[]'::jsonb not null,
  features jsonb default '[]'::jsonb not null,
  materials jsonb default '[]'::jsonb not null,
  tags jsonb default '[]'::jsonb not null,
  rating numeric default 0 not null,
  review_count integer default 0 not null,
  in_stock boolean default true not null,
  stock_count integer default 0 not null,
  is_new boolean default false not null,
  is_best_seller boolean default false not null,
  is_featured boolean default false not null,
  is_on_sale boolean default false not null,
  seo_title text,
  seo_description text,
  has_discreet_shipping boolean default true,
  warranty_text text,
  status text default 'draft' check (status in ('published', 'draft', 'archived')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  published_at timestamp with time zone
);

alter table public.products enable row level security;

create policy "Products are viewable by everyone."
  on products for select using ( true );

create policy "Only admins can modify products"
  on products for all 
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );
