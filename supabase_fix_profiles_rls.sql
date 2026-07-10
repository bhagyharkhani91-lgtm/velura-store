-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete any profile" ON public.profiles;

-- Create a secure function to check admin status
-- SECURITY DEFINER allows it to bypass RLS to prevent recursion issues
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Create updated policies using the secure function
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING ( public.is_admin() )
  WITH CHECK ( public.is_admin() );

CREATE POLICY "Admins can delete any profile"
  ON public.profiles FOR DELETE
  USING ( public.is_admin() );
