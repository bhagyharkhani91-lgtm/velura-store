-- Add payment_status column to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';

-- Update existing online orders to paid
UPDATE public.orders
SET payment_status = 'paid'
WHERE payment_method != 'Cash on Delivery (COD)';
