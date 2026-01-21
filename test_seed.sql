DO $$
DECLARE
  org_id uuid;
  profile_id uuid;
  new_flow_id uuid;
  version_id uuid;
BEGIN
  -- Get IDs
  SELECT id INTO org_id FROM organizations WHERE slug = 'teaching-com';
  SELECT id INTO profile_id FROM profiles WHERE organization_id = org_id LIMIT 1;

  -- Insert Flow
  INSERT INTO flows (organization_id, name, description, created_by)
  VALUES (org_id, 'Test Flow', 'Testing Insert', profile_id)
  RETURNING id INTO new_flow_id;

  -- Insert Version
  INSERT INTO flow_versions (flow_id, version_name, data, created_by)
  VALUES (new_flow_id, 'Initial Seed', '{"nodes": [{"id": "test", "label": "100% Test"}]}'::jsonb, profile_id)
  RETURNING id INTO version_id;

  -- Update Current
  UPDATE flows SET current_version_id = version_id WHERE id = new_flow_id;
END $$;
