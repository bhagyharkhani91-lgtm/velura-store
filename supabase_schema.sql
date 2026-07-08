-- Supabase Schema for Velura
-- Run this in your Supabase SQL Editor

-- ==========================================
-- 1. PROFILES (Users)
-- ==========================================
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text,
  phone text,
  date_of_birth text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select using ( true );

create policy "Users can insert their own profile."
  on profiles for insert with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update using ( auth.uid() = id );

create policy "Admins can update any profile"
  on profiles for update using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

create policy "Admins can delete any profile"
  on profiles for delete using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );


-- ==========================================
-- 2. CATEGORIES
-- ==========================================
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;

create policy "Categories are viewable by everyone."
  on categories for select using ( true );

create policy "Only admins can modify categories"
  on categories for all 
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );


-- ==========================================
-- 3. PRODUCTS
-- ==========================================
create table public.products (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  short_description text,
  description text,
  category_id uuid references public.categories(id),
  price numeric not null,
  compare_at_price numeric,
  in_stock boolean default true,
  stock_count integer default 0,
  is_new boolean default false,
  is_best_seller boolean default false,
  is_featured boolean default false,
  is_on_sale boolean default false,
  status text default 'draft' check (status in ('published', 'draft', 'archived')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

create policy "Products are viewable by everyone."
  on products for select using ( true );

create policy "Only admins can modify products"
  on products for all 
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );


-- ==========================================
-- 4. STORAGE
-- ==========================================
insert into storage.buckets (id, name, public) values ('images', 'images', true);

create policy "Images are publicly accessible."
  on storage.objects for select using ( bucket_id = 'images' );

create policy "Anyone can upload an image."
  on storage.objects for insert with check ( bucket_id = 'images' );
