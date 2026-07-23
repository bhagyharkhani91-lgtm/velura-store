-- ==========================================
-- Sanitize Product Names in Database
-- ==========================================
-- Run this in your Supabase SQL Editor to update all product names
-- to remove explicit/adult-oriented language for payment gateway compliance
-- ==========================================

-- Replace explicit product type names with wellness-focused alternatives
UPDATE public.products SET name = REPLACE(name, 'Masturbator', 'Massager');
UPDATE public.products SET name = REPLACE(name, 'masturbator', 'massager');
UPDATE public.products SET name = REPLACE(name, 'Dildo', 'Wellness Tool');
UPDATE public.products SET name = REPLACE(name, 'dildo', 'wellness tool');
UPDATE public.products SET name = REPLACE(name, 'Double-Ended Wellness Tool', 'Dual Wellness Tool');
UPDATE public.products SET name = REPLACE(name, 'double-ended', 'dual');
UPDATE public.products SET name = REPLACE(name, 'Vibrator', 'Massager');
UPDATE public.products SET name = REPLACE(name, 'vibrator', 'massager');
UPDATE public.products SET name = REPLACE(name, 'Rabbit Massager', 'Dual Action Massager');
UPDATE public.products SET name = REPLACE(name, 'rabbit massager', 'dual action massager');
UPDATE public.products SET name = REPLACE(name, 'Bullet Massager', 'Bullet Massager');
UPDATE public.products SET name = REPLACE(name, 'Wand Massager', 'Body Wand');
UPDATE public.products SET name = REPLACE(name, 'wand massager', 'body wand');
UPDATE public.products SET name = REPLACE(name, 'G-Spot Massager', 'Body Contour Massager');
UPDATE public.products SET name = REPLACE(name, 'g-spot massager', 'body contour massager');
UPDATE public.products SET name = REPLACE(name, 'Sensual', 'Comfort');
UPDATE public.products SET name = REPLACE(name, 'sensual', 'comfort');
UPDATE public.products SET name = REPLACE(name, 'Intimate', 'Personal');
UPDATE public.products SET name = REPLACE(name, 'intimate', 'personal');
UPDATE public.products SET name = REPLACE(name, 'Prostate Massager', 'Prostate Wellness Device');
UPDATE public.products SET name = REPLACE(name, 'prostate massager', 'prostate wellness device');
UPDATE public.products SET name = REPLACE(name, 'Butt Plug', 'Wellness Plug');
UPDATE public.products SET name = REPLACE(name, 'butt plug', 'wellness plug');
UPDATE public.products SET name = REPLACE(name, 'Anal', 'Therapeutic');
UPDATE public.products SET name = REPLACE(name, 'anal', 'therapeutic');
UPDATE public.products SET name = REPLACE(name, 'Bondage', 'Fitness');
UPDATE public.products SET name = REPLACE(name, 'bondage', 'fitness');
UPDATE public.products SET name = REPLACE(name, 'Crop', 'Massage Tool');
UPDATE public.products SET name = REPLACE(name, 'crop', 'massage tool');
UPDATE public.products SET name = REPLACE(name, 'Tickler', 'Sensory Tool');
UPDATE public.products SET name = REPLACE(name, 'tickler', 'sensory tool');
UPDATE public.products SET name = REPLACE(name, 'Collar and Leash', 'Accessory Set');
UPDATE public.products SET name = REPLACE(name, 'collar and leash', 'accessory set');
UPDATE public.products SET name = REPLACE(name, 'Shibari', 'Fitness');
UPDATE public.products SET name = REPLACE(name, 'shibari', 'fitness');
UPDATE public.products SET name = REPLACE(name, 'Discreet', 'Travel');
UPDATE public.products SET name = REPLACE(name, 'discreet', 'travel');

-- Also sanitize short_description and description fields
UPDATE public.products SET short_description = REPLACE(short_description, 'pleasure', 'relaxation');
UPDATE public.products SET short_description = REPLACE(short_description, 'satisfaction', 'wellness');
UPDATE public.products SET short_description = REPLACE(short_description, 'masturbator', 'massager');
UPDATE public.products SET short_description = REPLACE(short_description, 'vibrator', 'massager');
UPDATE public.products SET short_description = REPLACE(short_description, 'dildo', 'wellness tool');
UPDATE public.products SET short_description = REPLACE(short_description, 'sensual', 'comfort');
UPDATE public.products SET short_description = REPLACE(short_description, 'intimate', 'personal');
UPDATE public.products SET short_description = REPLACE(short_description, 'discreet', 'private');
UPDATE public.products SET short_description = REPLACE(short_description, 'g-spot', 'body contour');
UPDATE public.products SET short_description = REPLACE(short_description, 'G-Spot', 'Body Contour');
UPDATE public.products SET short_description = REPLACE(short_description, 'anal', 'therapeutic');
UPDATE public.products SET short_description = REPLACE(short_description, 'Anal', 'Therapeutic');
UPDATE public.products SET short_description = REPLACE(short_description, 'bondage', 'fitness');
UPDATE public.products SET short_description = REPLACE(short_description, 'Bondage', 'Fitness');
UPDATE public.products SET short_description = REPLACE(short_description, 'crop', 'massage tool');
UPDATE public.products SET short_description = REPLACE(short_description, 'Crop', 'Massage Tool');
UPDATE public.products SET short_description = REPLACE(short_description, 'prostate', 'wellness');
UPDATE public.products SET short_description = REPLACE(short_description, 'Prostate', 'Wellness');
UPDATE public.products SET short_description = REPLACE(short_description, 'butt plug', 'wellness plug');
UPDATE public.products SET short_description = REPLACE(short_description, 'Butt Plug', 'Wellness Plug');

UPDATE public.products SET description = REPLACE(description, 'pleasure', 'relaxation');
UPDATE public.products SET description = REPLACE(description, 'satisfaction', 'wellness');
UPDATE public.products SET description = REPLACE(description, 'masturbator', 'massager');
UPDATE public.products SET description = REPLACE(description, 'vibrator', 'massager');
UPDATE public.products SET description = REPLACE(description, 'dildo', 'wellness tool');
UPDATE public.products SET description = REPLACE(description, 'sensual', 'comfort');
UPDATE public.products SET description = REPLACE(description, 'intimate', 'personal');
UPDATE public.products SET description = REPLACE(description, 'discreet', 'private');
UPDATE public.products SET description = REPLACE(description, 'g-spot', 'body contour');
UPDATE public.products SET description = REPLACE(description, 'G-Spot', 'Body Contour');
UPDATE public.products SET description = REPLACE(description, 'anal', 'therapeutic');
UPDATE public.products SET description = REPLACE(description, 'Anal', 'Therapeutic');
UPDATE public.products SET description = REPLACE(description, 'bondage', 'fitness');
UPDATE public.products SET description = REPLACE(description, 'Bondage', 'Fitness');
UPDATE public.products SET description = REPLACE(description, 'crop', 'massage tool');
UPDATE public.products SET description = REPLACE(description, 'Crop', 'Massage Tool');
UPDATE public.products SET description = REPLACE(description, 'prostate', 'wellness');
UPDATE public.products SET description = REPLACE(description, 'Prostate', 'Wellness');
UPDATE public.products SET description = REPLACE(description, 'butt plug', 'wellness plug');
UPDATE public.products SET description = REPLACE(description, 'Butt Plug', 'Wellness Plug');

-- Update updated_at timestamp for all modified products
UPDATE public.products SET updated_at = timezone('utc'::text, now());

-- Verify changes
SELECT 'Product names sanitized. Count of affected products:' AS message;
SELECT COUNT(*) AS total_products FROM public.products;
