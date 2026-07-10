-- Add sizes and colors columns to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sizes jsonb DEFAULT '[]'::jsonb NOT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS colors jsonb DEFAULT '[]'::jsonb NOT NULL;
