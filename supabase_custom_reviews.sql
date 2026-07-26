-- Add reviewer_name column for admin-created custom reviews
ALTER TABLE public.product_reviews 
ADD COLUMN IF NOT EXISTS reviewer_name text;
