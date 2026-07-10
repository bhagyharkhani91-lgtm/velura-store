-- Add delivery_time column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS delivery_time text;
