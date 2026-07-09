-- Run this in the Supabase SQL Editor to add the new hero_banners column
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_banners jsonb DEFAULT '[]'::jsonb;
