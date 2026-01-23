-- Fix regression in handle_new_user introduced by team management update
-- Restore case-insensitive domain checks and robust organization creation

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  org_id uuid;
  user_domain text;
BEGIN
  -- Extract domain from email (LOWERCASE)
  user_domain := lower(split_part(new.email, '@', 2));
  
  -- Check if organization exists for this domain
  -- We assume organization domains are stored in lowercase, or we verify with lower()
  SELECT id INTO org_id FROM organizations WHERE lower(domain) = user_domain;
  
  -- Fallback: If no org found, maybe put them in a default or fail?
  -- For Phase 1: We assume the org exists or we create it if it's teaching.com
  IF org_id IS NULL AND user_domain = 'teaching.com' THEN
    -- Try to find it by slug first to avoid unique violation if domain was null/mismatch
    SELECT id INTO org_id FROM organizations WHERE slug = 'teaching-com';
    
    IF org_id IS NULL THEN
        INSERT INTO organizations (name, slug, domain)
        VALUES ('Teaching.com', 'teaching-com', 'teaching.com')
        RETURNING id INTO org_id;
    END IF;
    -- If found by slug (org_id is set), we proceed to use it.
  END IF;

  INSERT INTO public.profiles (id, full_name, avatar_url, organization_id, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    org_id,
    'viewer' -- Keep default as 'viewer' as per team management update
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
