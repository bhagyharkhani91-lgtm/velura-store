-- Run this in your Supabase SQL Editor to set up OTP verification

-- 1. Add email_verified column to profiles (if not exists)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;

-- 2. Create verification_otps table
CREATE TABLE IF NOT EXISTS public.verification_otps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  otp text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  attempts integer DEFAULT 0,
  verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.verification_otps ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access
CREATE POLICY "service_role can manage verification_otps"
  ON public.verification_otps
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant service_role permissions (CRITICAL: without this, service_role gets 403 on INSERT)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.verification_otps TO service_role;
