-- ============================================
-- Recent Purchase Notification (multiple)
-- Admin-controlled social proof popup shown on
-- the storefront home page bottom-left.
-- Stored as a jsonb array of:
--   { id, productId, message, isActive }
-- ============================================

alter table public.site_settings
  add column if not exists purchase_notification jsonb default null;

-- Migrate any legacy single-object value into an array.
do $$
declare
  Existing jsonb;
begin
  select purchase_notification into Existing
  from public.site_settings
  where id = 1;

  if Existing is not null and jsonb_typeof(Existing) = 'object' then
    if Existing ? 'productId' then
      update public.site_settings
      set purchase_notification = jsonb_build_array(Existing)
      where id = 1;
    else
      update public.site_settings set purchase_notification = null where id = 1;
    end if;
  end if;
end $$;