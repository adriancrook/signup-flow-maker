create or replace function public.handle_new_user()
returns trigger as $$
declare
  org_id uuid;
  user_domain text;
begin
  -- Extract domain from email (LOWERCASE)
  user_domain := lower(split_part(new.email, '@', 2));
  
  -- Check if organization exists for this domain
  -- We assume organization domains are stored in lowercase, or we verify with lower()
  select id into org_id from organizations where lower(domain) = user_domain;
  
  -- If not, and it's teaching.com, create it (First user provision)
  if org_id is null and user_domain = 'teaching.com' then
    -- Try to find it by slug first to avoid unique violation if domain was null/mismatch
    select id into org_id from organizations where slug = 'teaching-com';
    
    if org_id is null then
        insert into organizations (name, slug, domain)
        values ('Teaching.com', 'teaching-com', 'teaching.com')
        returning id into org_id;
    end if;
    -- If found by slug (org_id is set), we proceed to use it.
  end if;

  insert into public.profiles (id, full_name, avatar_url, organization_id, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    org_id,
    'editor'
  );
  return new;
end;
$$ language plpgsql security definer;
