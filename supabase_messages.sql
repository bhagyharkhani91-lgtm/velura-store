-- Create contact_messages table
drop table if exists public.contact_messages cascade;

create table public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text default 'unread' check (status in ('unread', 'read')),
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.contact_messages enable row level security;

-- Allow anyone to insert a message
drop policy if exists "Anyone can insert a contact message" on public.contact_messages;
create policy "Anyone can insert a contact message"
  on public.contact_messages for insert 
  with check ( true );

-- Only admins can view messages
drop policy if exists "Admins can view messages" on public.contact_messages;
create policy "Admins can view messages"
  on public.contact_messages for select 
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

-- Only admins can update messages (e.g. mark as read)
drop policy if exists "Admins can update messages" on public.contact_messages;
create policy "Admins can update messages"
  on public.contact_messages for update 
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

-- Only admins can delete messages
drop policy if exists "Admins can delete messages" on public.contact_messages;
create policy "Admins can delete messages"
  on public.contact_messages for delete 
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

-- Rate Limiting Trigger for Contact Messages
create or replace function public.rate_limit_contact_messages()
returns trigger as $$
declare
  client_ip text;
  recent_count integer;
begin
  -- Get the client IP address from the request headers
  client_ip := current_setting('request.headers', true)::json->>'x-forwarded-for';
  
  -- Fallback if not available (e.g., direct DB connections or local testing)
  if client_ip is null then
    return new;
  end if;

  -- Count messages from this IP in the last 1 hour
  select count(*) into recent_count
  from public.contact_messages
  where created_at > now() - interval '1 hour'
  and ip_address = client_ip;

  -- If more than 3 messages in the last hour, block the insert
  if recent_count >= 3 then
    raise exception 'Too many requests. Please try again later.';
  end if;

  -- Store the IP address in the new record
  new.ip_address := client_ip;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists rate_limit_contact_messages_trigger on public.contact_messages;
create trigger rate_limit_contact_messages_trigger
  before insert on public.contact_messages
  for each row
  execute function public.rate_limit_contact_messages();
