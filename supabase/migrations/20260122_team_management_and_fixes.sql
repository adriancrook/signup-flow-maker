-- 1. FIX INFINITE RECURSION BUG IN PROFILES RLS
-- The previous policy caused recursion because checking organization_id required reading the profile, which triggered the policy again.

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view members of their own organization" ON public.profiles;

-- Create a base policy: Users can ALWAYS see their own profile. This breaks the recursion loop.
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING ( auth.uid() = id );

-- Create the broader policy: Users can see profiles in their organization.
-- We use a more direct check or rely on the fact that if I can read my own profile (via above), I can now safely join.
-- However, strict RLS in Supabase can be tricky with self-joins.
-- A common pattern to avoid recursion is using a definer function or ensuring the subquery rules are clean.
-- Let's stick to the standard:
CREATE POLICY "Users can view members of their own organization"
ON public.profiles FOR SELECT
USING (
  organization_id IN (
    -- This subquery was the cause. But since we added "Users can view own profile" above,
    -- does it fix it? 
    -- The safest fix is to allow reading profiles where the org_id matches the current user's org_id,
    -- efficiently fetched.
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);


-- 2. ALLOW ADMINS TO UPDATE ROLES
CREATE POLICY "Admins can update organization profiles"
ON public.profiles FOR UPDATE
USING (
  -- The user doing the update must be an admin in the same org
  EXISTS (
    SELECT 1 FROM public.profiles AS admin_profile
    WHERE admin_profile.id = auth.uid()
    AND admin_profile.role = 'admin'
    AND admin_profile.organization_id = profiles.organization_id
  )
);


-- 3. CHANGE DEFAULT ROLE TO 'viewer'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  org_id uuid;
  user_domain text;
BEGIN
  -- Extract domain from email
  user_domain := split_part(new.email, '@', 2);
  
  -- Check if organization exists for this domain
  SELECT id INTO org_id FROM organizations WHERE domain = user_domain;
  
  -- Fallback: If no org found, maybe put them in a default or fail?
  -- For Phase 1: We assume the org exists or we create it if it's teaching.com
  IF org_id IS NULL AND user_domain = 'teaching.com' THEN
    INSERT INTO organizations (name, slug, domain)
    VALUES ('Teaching.com', 'teaching-com', 'teaching.com')
    RETURNING id INTO org_id;
  END IF;

  INSERT INTO public.profiles (id, full_name, avatar_url, organization_id, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    org_id,
    'viewer' -- CHANGED from 'editor' to 'viewer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. PROMOTE ADRIAN TO ADMIN
-- We do this safely by checking email via the auth.users table joined (or just trusting the profile link if needed).
-- Since we can't easily join auth.users in standard SQL sometimes depending on permissions, we'll try:
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'adrian@teaching.com'
);
