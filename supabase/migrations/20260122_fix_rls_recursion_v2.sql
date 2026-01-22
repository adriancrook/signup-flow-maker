-- FIX RLS RECURSION using SECURITY DEFINER functions
-- This prevents the RLS policy from triggering itself when checking permissions.

-- 1. Helper Function: Get My Org ID (Bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_my_org_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public -- Secure the function
STABLE
AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$;

-- 2. Helper Function: Am I Admin? (Bypasses RLS)
CREATE OR REPLACE FUNCTION public.i_am_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- 3. Update Policies to use these functions

-- Drop potentially recursive policies
DROP POLICY IF EXISTS "Users can view members of their own organization" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update organization profiles" ON public.profiles;

-- VIEW POLICY: Uses function
CREATE POLICY "Users can view members of their own organization"
ON public.profiles FOR SELECT
USING (
  organization_id = get_my_org_id()
);

-- UPDATE POLICY: Uses function
CREATE POLICY "Admins can update organization profiles"
ON public.profiles FOR UPDATE
USING (
  i_am_admin() 
  AND 
  organization_id = get_my_org_id()
);
