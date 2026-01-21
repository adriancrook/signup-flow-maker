-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------
-- 1. Organizations
-- Only users sharing the same domain @teaching.com auto-join.
-- ------------------------------------------------------
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  domain text unique, -- e.g. 'teaching.com'
  created_at timestamptz default now()
);

alter table organizations enable row level security;

-- Policy: Everyone can read organizations (needed for login/signup checks)
create policy "Organizations are viewable by everyone" 
on organizations for select using (true);

-- ------------------------------------------------------
-- 2. Profiles (extends auth.users)
-- ------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  organization_id uuid references organizations(id),
  full_name text,
  avatar_url text,
  role text check (role in ('admin', 'editor', 'viewer')) default 'viewer',
  updated_at timestamptz
);

alter table profiles enable row level security;

-- Policy: Users can see profiles in their own organization
create policy "Users can view members of their own organization"
on profiles for select
using (
  organization_id in (
    select organization_id from profiles where id = auth.uid()
  )
);

-- Policy: Users can update their own profile
create policy "Users can update their own profile"
on profiles for update
using ( id = auth.uid() );

-- ------------------------------------------------------
-- 3. Flows
-- The "Document" entity.
-- ------------------------------------------------------
create table flows (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) not null,
  name text not null,
  description text,
  is_locked boolean default false,
  
  -- We store the "current" version ID for quick access, 
  -- but it's a loose reference to avoid circular foreign key issues on insert.
  current_version_id uuid, 

  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table flows enable row level security;

-- Policy: View flows in same org
create policy "Org members can view flows"
on flows for select
using (
  organization_id in (
    select organization_id from profiles where id = auth.uid()
  )
);

-- Policy: Editors/Admins can create flows
create policy "Editors and Admins can create flows"
on flows for insert
with check (
  exists (
    select 1 from profiles
    where id = auth.uid()
    and organization_id = flows.organization_id
    and role in ('admin', 'editor')
  )
);

-- Policy: Editors/Admins can update flows
create policy "Editors and Admins can update flows"
on flows for update
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
    and organization_id = flows.organization_id
    and role in ('admin', 'editor')
  )
);

-- ------------------------------------------------------
-- 4. Flow Versions
-- Immutable snapshots.
-- ------------------------------------------------------
create table flow_versions (
  id uuid primary key default uuid_generate_v4(),
  flow_id uuid references flows(id) on delete cascade not null,
  version_name text,
  
  -- The core payload
  data jsonb not null, 
  
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

alter table flow_versions enable row level security;

-- Policy: View versions in same org (via flow -> org)
create policy "Org members can view flow versions"
on flow_versions for select
using (
  exists (
    select 1 from flows
    join profiles on profiles.organization_id = flows.organization_id
    where flows.id = flow_versions.flow_id
    and profiles.id = auth.uid()
  )
);

-- Policy: Editors/Admins can create versions
create policy "Editors and Admins can save versions"
on flow_versions for insert
with check (
  exists (
    select 1 from flows
    join profiles on profiles.organization_id = flows.organization_id
    where flows.id = flow_versions.flow_id
    and profiles.id = auth.uid()
    and profiles.role in ('admin', 'editor')
  )
);

-- ------------------------------------------------------
-- 5. Triggers & Functions
-- ------------------------------------------------------

-- Handle New User Signup -> Create Profile
create or replace function public.handle_new_user()
returns trigger as $$
declare
  org_id uuid;
  user_domain text;
begin
  -- Extract domain from email
  user_domain := split_part(new.email, '@', 2);
  
  -- Check if organization exists for this domain
  select id into org_id from organizations where domain = user_domain;
  
  -- If not, and it's teaching.com, create it (First user provision)
  -- Or strictly for now, we just look for it. Use a seed script to create the first org.
  
  -- Fallback: If no org found, maybe put them in a default or fail?
  -- For Phase 1: We assume the org exists or we create it if it's teaching.com
  if org_id is null and user_domain = 'teaching.com' then
    insert into organizations (name, slug, domain)
    values ('Teaching.com', 'teaching-com', 'teaching.com')
    returning id into org_id;
  end if;

  insert into public.profiles (id, full_name, avatar_url, organization_id, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    org_id,
    'editor' -- Default to editor for now for internal team
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at for flows
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_flows_updated_at
  before update on flows
  for each row execute procedure update_updated_at_column();
