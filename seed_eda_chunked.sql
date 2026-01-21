-- ==========================================
-- Flow: Educator District Admin
-- ==========================================
-- STEP 1: Init Flow
DO $$
DECLARE
  org_id uuid;
  profile_id uuid;
  new_flow_id uuid;
  version_id uuid;
BEGIN
  SELECT id INTO org_id FROM organizations WHERE slug = 'teaching-com';
  SELECT id INTO profile_id FROM profiles WHERE organization_id = org_id LIMIT 1;

  -- Create or Get Flow
  INSERT INTO flows (organization_id, name, description, created_by)
  VALUES (org_id, 'Educator District Admin', 'Imported (Chunked)', profile_id)
  RETURNING id INTO new_flow_id;

  -- Create Initial Empty Version
  INSERT INTO flow_versions (flow_id, version_name, data, created_by)
  VALUES (new_flow_id, 'Initial Seed', '{"nodes": [], "edges": []}'::jsonb, profile_id);
END $$;

-- STEP 2.1: Append Nodes 0 to 5
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator District Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{nodes}', (data->'nodes') || '[{"id":"m_5nguHLO1P15xjJCa6IQ","type":"MC","position":{"x":0,"y":0},"data":{"screen":{"id":"m_5nguHLO1P15xjJCa6IQ","type":"MC","title":"Who are you?","question":"I am a...","options":[{"id":"opt-tch","label":"Teacher","value":"teacher"},{"id":"opt-sch","label":"School Admin","value":"school-admin"},{"id":"opt-dst","label":"District Admin","value":"district-admin"}],"variableBinding":"role"},"label":"Educator Gatekeeper","code":"MC-GATEKEEPER-EDU","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"Sr1eiCar4eEKtx_1yYjQn","type":"MSG","position":{"x":360,"y":0},"data":{"screen":{"id":"Sr1eiCar4eEKtx_1yYjQn","type":"MSG","title":"Social Proof","style":"overlay","copy":"You are joining 50 million users who trust Typing.com.","headline":"Great choice!"},"label":"Social Proof","code":"MSG-SOCIAL-PROOF","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"yZVptd_ce1bStPQFG-_W6","type":"MC","position":{"x":720,"y":0},"data":{"screen":{"id":"yZVptd_ce1bStPQFG-_W6","type":"MC","title":"Confirm Location","question":"We detected you''re in [Detected State]. Is this correct?","options":[{"id":"opt-yes","label":"Yes","value":"yes"},{"id":"opt-no","label":"No, I''m in ___","value":"no"}],"variableBinding":"state"},"label":"Confirm Location","code":"MC-LOCATION-EDU","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"kNhiRZEeGEN4vwzEJqYQr","type":"NUM","position":{"x":1080,"y":0},"data":{"screen":{"id":"kNhiRZEeGEN4vwzEJqYQr","type":"NUM","title":"School Count","prompt":"How many schools in your district require a solution?","inputType":"number","variableBinding":"schoolCount"},"label":"School Count","code":"NUM-SCHOOLS-DST","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"-KzUO26-g8PrFFrSDO0_Y","type":"MSG","position":{"x":0,"y":320},"data":{"screen":{"id":"-KzUO26-g8PrFFrSDO0_Y","type":"MSG","title":"Master Dashboard","headline":"Multi-Tenant.","copy":"We provide a District Master Dashboard to manage all schools from a single login.","style":"standard"},"label":"Affirmation: District Scope","code":"MSG-DISTRICTSCOPE-DST-AFF","isValid":true,"isSelected":false,"isHighlighted":false}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 2.2: Append Nodes 5 to 10
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator District Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{nodes}', (data->'nodes') || '[{"id":"vubEV-2TInzFg5RA81mQZ","type":"MC","position":{"x":360,"y":320},"data":{"screen":{"id":"vubEV-2TInzFg5RA81mQZ","type":"MC","title":"Rostering","question":"How do you want your students to log in?","options":[{"id":"opt-google","label":"Google/Microsoft","value":"google"},{"id":"opt-clever","label":"Clever","value":"clever"},{"id":"opt-class","label":"Class Code","value":"manual"}],"variableBinding":"rosteringMethod"},"label":"Rostering","code":"MC-ROSTERING","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"gGQCMQNTWADtA_074rK5y","type":"MSG","position":{"x":720,"y":320},"data":{"screen":{"id":"gGQCMQNTWADtA_074rK5y","type":"MSG","title":"Nightly Sync","headline":"Certified Partner.","copy":"We are a certified partner with your provider and support automated nightly rostering updates.","style":"standard"},"label":"Affirmation: Rostering (District)","code":"MSG-ROSTERING-DST-AFF","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"jXxDJp_j8OQXcgfSRjXpD","type":"MC","position":{"x":1080,"y":320},"data":{"screen":{"id":"jXxDJp_j8OQXcgfSRjXpD","type":"MC","title":"Compliance","question":"Does your district require a signed DPA?","options":[{"id":"opt-yes","label":"Yes","value":"yes"},{"id":"opt-no","label":"No","value":"no"}],"variableBinding":"dpaStatus"},"label":"Compliance","code":"MC-COMPLIANCE-DST","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"KQfuW0yG3YeHyewX52FXD","type":"MSG","position":{"x":0,"y":640},"data":{"screen":{"id":"KQfuW0yG3YeHyewX52FXD","type":"MSG","title":"Legal Safety","headline":"Fully Compliant.","copy":"Your PLUS plan includes a signed DPA to satisfy your legal and security teams.","style":"standard"},"label":"Affirmation: Compliance","code":"MSG-COMPLIANCE-DST-AFF","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"QO-GeLhkp42ysSaRo0RLJ","type":"MC","position":{"x":360,"y":640},"data":{"screen":{"id":"QO-GeLhkp42ysSaRo0RLJ","type":"MC","title":"Dual Role","question":"Do you also teach your own classes?","options":[{"id":"opt-yes","label":"Yes","value":"yes","nextScreenId":"XSC-p9zooQSSdMZ25XB0L"},{"id":"opt-no","label":"No","value":"no","nextScreenId":"A9VC91_Hg3Qi94t4YyNDb"}],"variableBinding":"dualRole"},"label":"Dual Role","code":"MC-DUALROLE-EDU","isValid":true,"isSelected":false,"isHighlighted":false}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 2.3: Append Nodes 10 to 15
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator District Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{nodes}', (data->'nodes') || '[{"id":"XSC-p9zooQSSdMZ25XB0L","type":"MSG","position":{"x":720,"y":640},"data":{"screen":{"id":"XSC-p9zooQSSdMZ25XB0L","type":"MSG","title":"The Solution","headline":"Perfect.","copy":"You won''t need two accounts. Our Role Switcher lets you toggle instantly between District/School Oversight and Classroom Instruction.","style":"standard"},"label":"Affirmation: Dual Role","code":"MSG-DUALROLE-AFF","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"zScLDlotXDZtmcSZdvwbL","type":"MS","position":{"x":1080,"y":640},"data":{"screen":{"id":"zScLDlotXDZtmcSZdvwbL","type":"MS","title":"Teacher Content Needs","question":"For your own students, are you looking to teach skills beyond basic typing?","options":[{"id":"opt-coding","label":"Coding Basics","value":"coding"},{"id":"opt-digcit","label":"Digital Citizenship","value":"digcit"},{"id":"opt-typing","label":"Just Typing","value":"typing"}],"variableBinding":"teacherContent"},"label":"Question: Teacher Content (Dual)","code":"MS-CONTENT-TCH-DUAL","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"9go9M_3B9BoAs00LwSlA0","type":"MSG","position":{"x":0,"y":960},"data":{"screen":{"id":"9go9M_3B9BoAs00LwSlA0","type":"MSG","title":"Dual Access","headline":"Curriculum Unlocked.","copy":"Your account includes full access to the PLUS Curriculum for your students, while maintaining admin privileges.","style":"standard"},"label":"Affirmation: Teacher Content (Dual)","code":"MSG-TEACHERCONTENT-AFF","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"LCWpdwKzzRJ_bcXu2nuU0","type":"MC","position":{"x":360,"y":960},"data":{"screen":{"id":"LCWpdwKzzRJ_bcXu2nuU0","type":"MC","title":"Teacher Accessibility","question":"Do the students in your specific classes need accessibility accommodations?","options":[{"id":"opt-yes","label":"Yes, I have specific needs","value":"yes"},{"id":"opt-no","label":"No, standard is fine","value":"no"}],"variableBinding":"teacherAccessibility"},"label":"Question: Teacher Accessibility (Dual)","code":"MC-ACCESSIBILITY-TCH-DUAL","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"tKYcgm7BYjC87RiXEfCL7","type":"MSG","position":{"x":720,"y":960},"data":{"screen":{"id":"tKYcgm7BYjC87RiXEfCL7","type":"MSG","title":"Granular Control","headline":"We''ve got you covered.","copy":"You can apply specific accessibility settings to your own roster without altering global settings.","style":"standard"},"label":"Affirmation: Teacher Access (Dual)","code":"MSG-TEACHERACCESS-AFF","isValid":true,"isSelected":false,"isHighlighted":false}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 2.4: Append Nodes 15 to 19
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator District Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{nodes}', (data->'nodes') || '[{"id":"A9VC91_Hg3Qi94t4YyNDb","type":"MC","position":{"x":1080,"y":960},"data":{"screen":{"id":"A9VC91_Hg3Qi94t4YyNDb","type":"MC","title":"Discovery","question":"How did you hear about us?","options":[{"id":"opt-search","label":"Search Engine","value":"search"},{"id":"opt-social","label":"Social Media","value":"social"},{"id":"opt-friend","label":"Friend/Colleague","value":"friend"}],"variableBinding":"discoverySource","variants":{"student":{"options":[{"id":"opt-teacher","label":"Teacher","value":"teacher"},{"id":"opt-friend","label":"Friend/Classmate","value":"friend"},{"id":"opt-social","label":"Social Media","value":"social"},{"id":"opt-search","label":"Search Engine","value":"search"}]},"parent":{"options":[{"id":"opt-teacher","label":"Teacher","value":"teacher"},{"id":"opt-friend","label":"Friend/Classmate","value":"friend"},{"id":"opt-social","label":"Social Media","value":"social"},{"id":"opt-search","label":"Search Engine","value":"search"}]},"adult":{"options":[{"id":"opt-coworker","label":"Coworker","value":"coworker"},{"id":"opt-friend","label":"Friend","value":"friend"},{"id":"opt-social","label":"Social Media","value":"social"},{"id":"opt-search","label":"Search Engine","value":"search"}]},"teacher":{"options":[{"id":"opt-colleague","label":"Colleague","value":"colleague"},{"id":"opt-conf","label":"Conference/PD","value":"conference"},{"id":"opt-social","label":"Social Media","value":"social"},{"id":"opt-search","label":"Search Engine","value":"search"},{"id":"opt-dist","label":"District Recommendation","value":"district"}]},"school-admin":{"options":[{"id":"opt-colleague","label":"Colleague","value":"colleague"},{"id":"opt-conf","label":"Conference/PD","value":"conference"},{"id":"opt-social","label":"Social Media","value":"social"},{"id":"opt-search","label":"Search Engine","value":"search"},{"id":"opt-dist","label":"District Recommendation","value":"district"}]},"district-admin":{"options":[{"id":"opt-colleague","label":"Colleague","value":"colleague"},{"id":"opt-conf","label":"Conference/PD","value":"conference"},{"id":"opt-social","label":"Social Media","value":"social"},{"id":"opt-search","label":"Search Engine","value":"search"},{"id":"opt-dist","label":"District Recommendation","value":"district"}]}}},"label":"Discovery","code":"MC-DISCOVERY","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"QuJA7e5pWtBN7cJ6MVtn6","type":"INT","position":{"x":0,"y":1280},"data":{"screen":{"id":"QuJA7e5pWtBN7cJ6MVtn6","type":"INT","title":"Plan Analysis","headline":"Building Your Plan...","duration":3000,"animation":"progress-bar","messages":[{"text":"Analyzing inputs..."},{"text":"Generating curriculum..."},{"text":"Finalizing..."}],"variants":{"student":{"headline":"Building Your Plan...","messages":[{"text":"Measuring your baseline..."},{"text":"Setting target speed..."},{"text":"Optimizing curriculum..."}]},"parent":{"headline":"Building Plan...","messages":[{"text":"Assessing typing level..."},{"text":"Calibrating tech literacy modules..."},{"text":"Addressing screen time concerns..."}]},"adult":{"headline":"Building Your Plan...","messages":[{"text":"Optimizing for your goal..."},{"text":"Tackling your barriers..."},{"text":"Finalizing roadmap..."}]},"teacher":{"headline":"Building Classroom Plan...","messages":[{"text":"Confirming standards alignment..."},{"text":"Loading curriculum..."},{"text":"Configuring rostering..."}]},"school-admin":{"headline":"Building School Plan...","messages":[{"text":"Scaling for student count..."},{"text":"Securing environment..."},{"text":"Enabling data retention..."}]},"district-admin":{"headline":"Building District Plan...","messages":[{"text":"Mapping schools to dashboard..."},{"text":"Verifying rostering protocols..."},{"text":"Preparing compliance docs..."}]}}},"label":"Plan Analysis","code":"INT-PLAN-ANALYSIS","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"lU91xZMQlRYwjEAW3T7sy","type":"FORM","position":{"x":360,"y":1280},"data":{"screen":{"id":"lU91xZMQlRYwjEAW3T7sy","type":"FORM","title":"Create Account","headline":"Your Plan is Ready","copy":"Create details to save your plan.","collectFields":["email","password"],"showSocialLogin":true,"variants":{"student":{"headline":"Your customized typing plan is ready!","copy":"We''ve built a roadmap to help you reach your goal."},"parent":{"headline":"Save your child''s custom plan","copy":"We''ve generated your child''s personalized roadmap."},"adult":{"headline":"Your customized typing plan is ready!","copy":"We''ve built a roadmap to help you reach your goal."},"teacher":{"headline":"Your Classroom is Ready.","copy":"Create your free account to save your classroom settings."},"school-admin":{"headline":"Secure Your School''s Learning Environment.","copy":"Create an account to save your school''s data configuration."},"district-admin":{"headline":"Your Compliant District Plan.","copy":"Solve your privacy requirements and rostering infrastructure today."}}},"label":"Signup Form","code":"FORM-SIGNUP","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"DG-wlMREYE9Eqarieui0X","type":"PAY","position":{"x":720,"y":1280},"data":{"screen":{"id":"DG-wlMREYE9Eqarieui0X","type":"PAY","title":"PLUS Plan","headline":"Unlock Full Experience","valuePropositions":["Ad-free learning","Unlimited history","Certificates"],"primaryAction":{"label":"Upgrade","action":"upgrade"},"variants":{"student":{"headline":"Unlock the Full Experience","valuePropositions":["Premium Content","Zero Distractions"]},"parent":{"headline":"Unlock the Full Experience for [Child Name]","valuePropositions":["Premium Content","Zero Distractions"]},"adult":{"headline":"Your Typing.com PLUS plan is ready","valuePropositions":["Ad-free learning","Certificates","Unlimited history"]},"teacher":{"headline":"Unlock the Full Classroom Experience","valuePropositions":["Full Coding Curriculum","Ad-free environment","Student progress tracking"]},"school-admin":{"headline":"Your School''s Ad-Free Quote","valuePropositions":["100%% Ad-Free Walled Garden","Unlimited Data Retention","School-wide SSO"]},"district-admin":{"headline":"Your District Implementation Roadmap","valuePropositions":["100%% Ad-Free Walled Garden","Signed DPA Compliance","District Master Dashboard"]}}},"label":"Plus Paywall","code":"PAY-PLUS","isValid":true,"isSelected":false,"isHighlighted":false}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 3.1: Append Edges 0 to 5
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator District Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{edges}', (data->'edges') || '[{"id":"e-m_5nguHLO1P15xjJCa6IQ-Sr1eiCar4eEKtx_1yYjQn","source":"m_5nguHLO1P15xjJCa6IQ","target":"Sr1eiCar4eEKtx_1yYjQn","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-Sr1eiCar4eEKtx_1yYjQn-yZVptd_ce1bStPQFG-_W6","source":"Sr1eiCar4eEKtx_1yYjQn","target":"yZVptd_ce1bStPQFG-_W6","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-yZVptd_ce1bStPQFG-_W6-kNhiRZEeGEN4vwzEJqYQr","source":"yZVptd_ce1bStPQFG-_W6","target":"kNhiRZEeGEN4vwzEJqYQr","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-kNhiRZEeGEN4vwzEJqYQr--KzUO26-g8PrFFrSDO0_Y","source":"kNhiRZEeGEN4vwzEJqYQr","target":"-KzUO26-g8PrFFrSDO0_Y","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e--KzUO26-g8PrFFrSDO0_Y-vubEV-2TInzFg5RA81mQZ","source":"-KzUO26-g8PrFFrSDO0_Y","target":"vubEV-2TInzFg5RA81mQZ","type":"smoothstep","animated":true,"data":{"isDefault":true}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 3.2: Append Edges 5 to 10
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator District Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{edges}', (data->'edges') || '[{"id":"e-vubEV-2TInzFg5RA81mQZ-gGQCMQNTWADtA_074rK5y","source":"vubEV-2TInzFg5RA81mQZ","target":"gGQCMQNTWADtA_074rK5y","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-gGQCMQNTWADtA_074rK5y-jXxDJp_j8OQXcgfSRjXpD","source":"gGQCMQNTWADtA_074rK5y","target":"jXxDJp_j8OQXcgfSRjXpD","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-jXxDJp_j8OQXcgfSRjXpD-KQfuW0yG3YeHyewX52FXD","source":"jXxDJp_j8OQXcgfSRjXpD","target":"KQfuW0yG3YeHyewX52FXD","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-KQfuW0yG3YeHyewX52FXD-QO-GeLhkp42ysSaRo0RLJ","source":"KQfuW0yG3YeHyewX52FXD","target":"QO-GeLhkp42ysSaRo0RLJ","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-XSC-p9zooQSSdMZ25XB0L-zScLDlotXDZtmcSZdvwbL","source":"XSC-p9zooQSSdMZ25XB0L","target":"zScLDlotXDZtmcSZdvwbL","type":"smoothstep","animated":true,"data":{"isDefault":true}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 3.3: Append Edges 10 to 15
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator District Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{edges}', (data->'edges') || '[{"id":"e-zScLDlotXDZtmcSZdvwbL-9go9M_3B9BoAs00LwSlA0","source":"zScLDlotXDZtmcSZdvwbL","target":"9go9M_3B9BoAs00LwSlA0","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-9go9M_3B9BoAs00LwSlA0-LCWpdwKzzRJ_bcXu2nuU0","source":"9go9M_3B9BoAs00LwSlA0","target":"LCWpdwKzzRJ_bcXu2nuU0","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-LCWpdwKzzRJ_bcXu2nuU0-tKYcgm7BYjC87RiXEfCL7","source":"LCWpdwKzzRJ_bcXu2nuU0","target":"tKYcgm7BYjC87RiXEfCL7","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-tKYcgm7BYjC87RiXEfCL7-A9VC91_Hg3Qi94t4YyNDb","source":"tKYcgm7BYjC87RiXEfCL7","target":"A9VC91_Hg3Qi94t4YyNDb","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-A9VC91_Hg3Qi94t4YyNDb-QuJA7e5pWtBN7cJ6MVtn6","source":"A9VC91_Hg3Qi94t4YyNDb","target":"QuJA7e5pWtBN7cJ6MVtn6","type":"smoothstep","animated":true,"data":{"isDefault":true}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 3.4: Append Edges 15 to 19
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator District Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{edges}', (data->'edges') || '[{"id":"e-QuJA7e5pWtBN7cJ6MVtn6-lU91xZMQlRYwjEAW3T7sy","source":"QuJA7e5pWtBN7cJ6MVtn6","target":"lU91xZMQlRYwjEAW3T7sy","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-lU91xZMQlRYwjEAW3T7sy-DG-wlMREYE9Eqarieui0X","source":"lU91xZMQlRYwjEAW3T7sy","target":"DG-wlMREYE9Eqarieui0X","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-QO-GeLhkp42ysSaRo0RLJ-XSC-p9zooQSSdMZ25XB0L-opt-yes","source":"QO-GeLhkp42ysSaRo0RLJ","target":"XSC-p9zooQSSdMZ25XB0L","sourceHandle":"opt-yes","type":"smoothstep","animated":true,"label":"Yes","data":{"label":"Yes"}},{"id":"e-QO-GeLhkp42ysSaRo0RLJ-A9VC91_Hg3Qi94t4YyNDb-opt-no","source":"QO-GeLhkp42ysSaRo0RLJ","target":"A9VC91_Hg3Qi94t4YyNDb","sourceHandle":"opt-no","type":"smoothstep","animated":true,"label":"No","data":{"label":"No"}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 4: Set Current Version
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator District Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flows SET current_version_id = v_id WHERE id = f_id;
END $$;

