-- Run this in the Supabase SQL Editor to add the new hero_banners_mobile column
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_banners_mobile jsonb DEFAULT '[]'::jsonb;
