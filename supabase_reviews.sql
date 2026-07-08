-- Recreate product reviews table
drop table if exists public.product_reviews cascade;

create table public.product_reviews (
  id uuid default gen_random_uuid() primary key,
  product_id text not null references public.products(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  content text not null,
  images jsonb default '[]'::jsonb not null,
  status text default 'approved' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.product_reviews enable row level security;

drop policy if exists "Approved reviews are viewable by everyone" on public.product_reviews;
create policy "Approved reviews are viewable by everyone"
  on public.product_reviews for select 
  using ( status = 'approved' );

drop policy if exists "Users can view their own reviews" on public.product_reviews;
create policy "Users can view their own reviews"
  on public.product_reviews for select 
  using ( auth.uid() = user_id );

drop policy if exists "Admins can view all reviews" on public.product_reviews;
create policy "Admins can view all reviews"
  on public.product_reviews for select 
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

drop policy if exists "Authenticated users can insert reviews" on public.product_reviews;
create policy "Authenticated users can insert reviews"
  on public.product_reviews for insert 
  with check ( auth.uid() = user_id );

drop policy if exists "Admins can update reviews" on public.product_reviews;
create policy "Admins can update reviews"
  on public.product_reviews for update 
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

drop policy if exists "Admins can delete reviews" on public.product_reviews;
create policy "Admins can delete reviews"
  on public.product_reviews for delete 
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );
