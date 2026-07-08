-- Run this in your Supabase SQL Editor to automatically create a profile when a user signs up.

-- 1. Create the function
create or replace function public.handle_new_user() 
returns trigger 
language plpgsql 
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name', 
    'customer'
  );
  return new;
end;
$$;

-- 2. Create the trigger (Drop it first if it exists to avoid errors)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
