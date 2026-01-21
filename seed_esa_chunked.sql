-- ==========================================
-- Flow: Educator School Admin
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
  VALUES (org_id, 'Educator School Admin', 'Imported (Chunked)', profile_id)
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
  SELECT id INTO f_id FROM flows WHERE name = 'Educator School Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{nodes}', (data->'nodes') || '[{"id":"DM1bMZPn1141syRYP0as0","type":"MC","position":{"x":0,"y":0},"data":{"screen":{"id":"DM1bMZPn1141syRYP0as0","type":"MC","title":"Who are you?","question":"I am a...","options":[{"id":"opt-tch","label":"Teacher","value":"teacher"},{"id":"opt-sch","label":"School Admin","value":"school-admin"},{"id":"opt-dst","label":"District Admin","value":"district-admin"}],"variableBinding":"role"},"label":"Educator Gatekeeper","code":"MC-GATEKEEPER-EDU","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"1Ds-OqEoxdvr-XiroJx-2","type":"MSG","position":{"x":360,"y":0},"data":{"screen":{"id":"1Ds-OqEoxdvr-XiroJx-2","type":"MSG","title":"Social Proof","style":"overlay","copy":"You are joining 50 million users who trust Typing.com.","headline":"Great choice!"},"label":"Social Proof","code":"MSG-SOCIAL-PROOF","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"1O2Gy7NlHNaHAXe1liHUH","type":"MC","position":{"x":720,"y":0},"data":{"screen":{"id":"1O2Gy7NlHNaHAXe1liHUH","type":"MC","title":"Confirm Location","question":"We detected you''re in [Detected State]. Is this correct?","options":[{"id":"opt-yes","label":"Yes","value":"yes"},{"id":"opt-no","label":"No, I''m in ___","value":"no"}],"variableBinding":"state"},"label":"Confirm Location","code":"MC-LOCATION-EDU","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"jBIoiMCCoIenCIPYM_VId","type":"NUM","position":{"x":1080,"y":0},"data":{"screen":{"id":"jBIoiMCCoIenCIPYM_VId","type":"NUM","title":"Student Count","prompt":"How many students do you teach?","placeholder":"e.g. 25","inputType":"number","variableBinding":"studentCount"},"label":"Student Count","code":"NUM-STUDENTS","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"S-hlytg9iwjDRNqcaP43n","type":"MSG","position":{"x":0,"y":320},"data":{"screen":{"id":"S-hlytg9iwjDRNqcaP43n","type":"MSG","title":"Scalability","headline":"Scalable.","copy":"Our platform is optimized to handle high-volume traffic for schools your size.","style":"standard"},"label":"Affirmation: School Size","code":"MSG-SCHOOLSIZE-SCH-AFF","isValid":true,"isSelected":false,"isHighlighted":false}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 2.2: Append Nodes 5 to 10
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator School Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{nodes}', (data->'nodes') || '[{"id":"FQ2LaxPiGVteE6Gcd4Jw1","type":"MC","position":{"x":360,"y":320},"data":{"screen":{"id":"FQ2LaxPiGVteE6Gcd4Jw1","type":"MC","title":"Rostering","question":"How do you want your students to log in?","options":[{"id":"opt-google","label":"Google/Microsoft","value":"google"},{"id":"opt-clever","label":"Clever","value":"clever"},{"id":"opt-class","label":"Class Code","value":"manual"}],"variableBinding":"rosteringMethod"},"label":"Rostering","code":"MC-ROSTERING","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"aVVpauWWk_2fLJ1vwE-Eh","type":"MSG","position":{"x":720,"y":320},"data":{"screen":{"id":"aVVpauWWk_2fLJ1vwE-Eh","type":"MSG","title":"Infrastructure","headline":"Great.","copy":"We support Single Sign-On (SSO) to make school-wide deployment instant.","style":"standard"},"label":"Affirmation: Rostering (School)","code":"MSG-ROSTERING-SCH-AFF","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"ZZc2n9fAGd9zXSnXlsgyi","type":"MC","position":{"x":1080,"y":320},"data":{"screen":{"id":"ZZc2n9fAGd9zXSnXlsgyi","type":"MC","title":"Environment","question":"How important is removing ads?","options":[{"id":"opt-very","label":"Very Important","value":"very"},{"id":"opt-some","label":"Somewhat","value":"somewhat"},{"id":"opt-not","label":"Not a Priority","value":"none"}],"variableBinding":"adImportance"},"label":"Ads Concern","code":"MC-ENVIRONMENT","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"NHFU5EBkEN06vE1pUKBhV","type":"MSG","position":{"x":0,"y":640},"data":{"screen":{"id":"NHFU5EBkEN06vE1pUKBhV","type":"MSG","title":"Walled Garden","headline":"We hear you.","copy":"That''s why PLUS creates a 100%% Ad-Free, Walled Garden environment to minimize risk.","style":"standard"},"label":"Affirmation: Environment (School)","code":"MSG-ENVIRONMENT-SCH-AFF","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"p2sY7XWB3bcLL8xY9rvVg","type":"MC","position":{"x":360,"y":640},"data":{"screen":{"id":"p2sY7XWB3bcLL8xY9rvVg","type":"MC","title":"Data Retention","question":"Do you need to track growth year-over-year?","options":[{"id":"opt-yes","label":"Yes","value":"yes"},{"id":"opt-no","label":"No","value":"no"}],"variableBinding":"dataRetention"},"label":"Data Retention","code":"MC-RETENTION","isValid":true,"isSelected":false,"isHighlighted":false}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 2.3: Append Nodes 10 to 15
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator School Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{nodes}', (data->'nodes') || '[{"id":"piEg42HPSJyYFSLUPt6dL","type":"MSG","position":{"x":720,"y":640},"data":{"screen":{"id":"piEg42HPSJyYFSLUPt6dL","type":"MSG","title":"Unlimited History","headline":"Noted.","copy":"We will enable Unlimited Data Retention for your account (removing the standard 70-day limit).","style":"standard"},"label":"Affirmation: Retention","code":"MSG-RETENTION-SCH-AFF","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"SKEy5_t1ZF8ZskyISdpvU","type":"MC","position":{"x":1080,"y":640},"data":{"screen":{"id":"SKEy5_t1ZF8ZskyISdpvU","type":"MC","title":"Analytics","question":"Do you need ROI reporting?","options":[{"id":"opt-yes","label":"Yes","value":"yes"},{"id":"opt-no","label":"No","value":"no"}],"variableBinding":"analytics"},"label":"Analytics / ROI","code":"MC-ANALYTICS","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"JzyR6y_LyE-Mjcmp9JFKY","type":"MSG","position":{"x":0,"y":960},"data":{"screen":{"id":"JzyR6y_LyE-Mjcmp9JFKY","type":"MSG","title":"Admin Console","headline":"Visible ROI.","copy":"Our Admin Console provides analytics to prove utilization and ROI.","style":"standard"},"label":"Affirmation: Analytics","code":"MSG-ANALYTICS-SCH-AFF","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"6N9MxPYeU2EhCbkYFKxIV","type":"MC","position":{"x":360,"y":960},"data":{"screen":{"id":"6N9MxPYeU2EhCbkYFKxIV","type":"MC","title":"Dual Role","question":"Do you also teach your own classes?","options":[{"id":"opt-yes","label":"Yes","value":"yes","nextScreenId":"9B7w1CrzoTvvLfPSpT3MB"},{"id":"opt-no","label":"No","value":"no","nextScreenId":"CODE:MC-DISCOVERY-EDU"}],"variableBinding":"dualRole"},"label":"Dual Role","code":"MC-DUALROLE-EDU","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"9B7w1CrzoTvvLfPSpT3MB","type":"MSG","position":{"x":720,"y":960},"data":{"screen":{"id":"9B7w1CrzoTvvLfPSpT3MB","type":"MSG","title":"The Solution","headline":"Perfect.","copy":"You won''t need two accounts. Our Role Switcher lets you toggle instantly between District/School Oversight and Classroom Instruction.","style":"standard"},"label":"Affirmation: Dual Role","code":"MSG-DUALROLE-AFF","isValid":true,"isSelected":false,"isHighlighted":false}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 2.4: Append Nodes 15 to 20
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator School Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{nodes}', (data->'nodes') || '[{"id":"s3soYl-XjyLlCGXmdx-XI","type":"MS","position":{"x":1080,"y":960},"data":{"screen":{"id":"s3soYl-XjyLlCGXmdx-XI","type":"MS","title":"Teacher Content Needs","question":"For your own students, are you looking to teach skills beyond basic typing?","options":[{"id":"opt-coding","label":"Coding Basics","value":"coding"},{"id":"opt-digcit","label":"Digital Citizenship","value":"digcit"},{"id":"opt-typing","label":"Just Typing","value":"typing"}],"variableBinding":"teacherContent"},"label":"Question: Teacher Content (Dual)","code":"MS-CONTENT-TCH-DUAL","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"Ut6IZ0qxn_wULRkCer7RY","type":"MSG","position":{"x":0,"y":1280},"data":{"screen":{"id":"Ut6IZ0qxn_wULRkCer7RY","type":"MSG","title":"Dual Access","headline":"Curriculum Unlocked.","copy":"Your account includes full access to the PLUS Curriculum for your students, while maintaining admin privileges.","style":"standard"},"label":"Affirmation: Teacher Content (Dual)","code":"MSG-TEACHERCONTENT-AFF","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"r9dIQcb1Ctu1nNYNkCpte","type":"MC","position":{"x":360,"y":1280},"data":{"screen":{"id":"r9dIQcb1Ctu1nNYNkCpte","type":"MC","title":"Teacher Accessibility","question":"Do the students in your specific classes need accessibility accommodations?","options":[{"id":"opt-yes","label":"Yes, I have specific needs","value":"yes"},{"id":"opt-no","label":"No, standard is fine","value":"no"}],"variableBinding":"teacherAccessibility"},"label":"Question: Teacher Accessibility (Dual)","code":"MC-ACCESSIBILITY-TCH-DUAL","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"RlEKGCyonqa99fqSs9C1-","type":"MSG","position":{"x":720,"y":1280},"data":{"screen":{"id":"RlEKGCyonqa99fqSs9C1-","type":"MSG","title":"Granular Control","headline":"We''ve got you covered.","copy":"You can apply specific accessibility settings to your own roster without altering global settings.","style":"standard"},"label":"Affirmation: Teacher Access (Dual)","code":"MSG-TEACHERACCESS-AFF","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"FyWi5Rp4fjvPSV4ijlOhe","type":"MC","position":{"x":1080,"y":1280},"data":{"screen":{"id":"FyWi5Rp4fjvPSV4ijlOhe","type":"MC","title":"Discovery","question":"How did you hear about us?","options":[{"id":"opt-search","label":"Search Engine","value":"search"},{"id":"opt-social","label":"Social Media","value":"social"},{"id":"opt-friend","label":"Friend/Colleague","value":"friend"}],"variableBinding":"discoverySource","variants":{"student":{"options":[{"id":"opt-teacher","label":"Teacher","value":"teacher"},{"id":"opt-friend","label":"Friend/Classmate","value":"friend"},{"id":"opt-social","label":"Social Media","value":"social"},{"id":"opt-search","label":"Search Engine","value":"search"}]},"parent":{"options":[{"id":"opt-teacher","label":"Teacher","value":"teacher"},{"id":"opt-friend","label":"Friend/Classmate","value":"friend"},{"id":"opt-social","label":"Social Media","value":"social"},{"id":"opt-search","label":"Search Engine","value":"search"}]},"adult":{"options":[{"id":"opt-coworker","label":"Coworker","value":"coworker"},{"id":"opt-friend","label":"Friend","value":"friend"},{"id":"opt-social","label":"Social Media","value":"social"},{"id":"opt-search","label":"Search Engine","value":"search"}]},"teacher":{"options":[{"id":"opt-colleague","label":"Colleague","value":"colleague"},{"id":"opt-conf","label":"Conference/PD","value":"conference"},{"id":"opt-social","label":"Social Media","value":"social"},{"id":"opt-search","label":"Search Engine","value":"search"},{"id":"opt-dist","label":"District Recommendation","value":"district"}]},"school-admin":{"options":[{"id":"opt-colleague","label":"Colleague","value":"colleague"},{"id":"opt-conf","label":"Conference/PD","value":"conference"},{"id":"opt-social","label":"Social Media","value":"social"},{"id":"opt-search","label":"Search Engine","value":"search"},{"id":"opt-dist","label":"District Recommendation","value":"district"}]},"district-admin":{"options":[{"id":"opt-colleague","label":"Colleague","value":"colleague"},{"id":"opt-conf","label":"Conference/PD","value":"conference"},{"id":"opt-social","label":"Social Media","value":"social"},{"id":"opt-search","label":"Search Engine","value":"search"},{"id":"opt-dist","label":"District Recommendation","value":"district"}]}}},"label":"Discovery","code":"MC-DISCOVERY","isValid":true,"isSelected":false,"isHighlighted":false}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 2.5: Append Nodes 20 to 23
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator School Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{nodes}', (data->'nodes') || '[{"id":"TAZDoihTR7piX4NMVVrT4","type":"INT","position":{"x":0,"y":1600},"data":{"screen":{"id":"TAZDoihTR7piX4NMVVrT4","type":"INT","title":"Plan Analysis","headline":"Building Your Plan...","duration":3000,"animation":"progress-bar","messages":[{"text":"Analyzing inputs..."},{"text":"Generating curriculum..."},{"text":"Finalizing..."}],"variants":{"student":{"headline":"Building Your Plan...","messages":[{"text":"Measuring your baseline..."},{"text":"Setting target speed..."},{"text":"Optimizing curriculum..."}]},"parent":{"headline":"Building Plan...","messages":[{"text":"Assessing typing level..."},{"text":"Calibrating tech literacy modules..."},{"text":"Addressing screen time concerns..."}]},"adult":{"headline":"Building Your Plan...","messages":[{"text":"Optimizing for your goal..."},{"text":"Tackling your barriers..."},{"text":"Finalizing roadmap..."}]},"teacher":{"headline":"Building Classroom Plan...","messages":[{"text":"Confirming standards alignment..."},{"text":"Loading curriculum..."},{"text":"Configuring rostering..."}]},"school-admin":{"headline":"Building School Plan...","messages":[{"text":"Scaling for student count..."},{"text":"Securing environment..."},{"text":"Enabling data retention..."}]},"district-admin":{"headline":"Building District Plan...","messages":[{"text":"Mapping schools to dashboard..."},{"text":"Verifying rostering protocols..."},{"text":"Preparing compliance docs..."}]}}},"label":"Plan Analysis","code":"INT-PLAN-ANALYSIS","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"bSg3TrgXMJyxvcTCL9uSm","type":"FORM","position":{"x":360,"y":1600},"data":{"screen":{"id":"bSg3TrgXMJyxvcTCL9uSm","type":"FORM","title":"Create Account","headline":"Your Plan is Ready","copy":"Create details to save your plan.","collectFields":["email","password"],"showSocialLogin":true,"variants":{"student":{"headline":"Your customized typing plan is ready!","copy":"We''ve built a roadmap to help you reach your goal."},"parent":{"headline":"Save your child''s custom plan","copy":"We''ve generated your child''s personalized roadmap."},"adult":{"headline":"Your customized typing plan is ready!","copy":"We''ve built a roadmap to help you reach your goal."},"teacher":{"headline":"Your Classroom is Ready.","copy":"Create your free account to save your classroom settings."},"school-admin":{"headline":"Secure Your School''s Learning Environment.","copy":"Create an account to save your school''s data configuration."},"district-admin":{"headline":"Your Compliant District Plan.","copy":"Solve your privacy requirements and rostering infrastructure today."}}},"label":"Signup Form","code":"FORM-SIGNUP","isValid":true,"isSelected":false,"isHighlighted":false}},{"id":"QXL1VdLGkpF6O3v7FufEs","type":"PAY","position":{"x":720,"y":1600},"data":{"screen":{"id":"QXL1VdLGkpF6O3v7FufEs","type":"PAY","title":"PLUS Plan","headline":"Unlock Full Experience","valuePropositions":["Ad-free learning","Unlimited history","Certificates"],"primaryAction":{"label":"Upgrade","action":"upgrade"},"variants":{"student":{"headline":"Unlock the Full Experience","valuePropositions":["Premium Content","Zero Distractions"]},"parent":{"headline":"Unlock the Full Experience for [Child Name]","valuePropositions":["Premium Content","Zero Distractions"]},"adult":{"headline":"Your Typing.com PLUS plan is ready","valuePropositions":["Ad-free learning","Certificates","Unlimited history"]},"teacher":{"headline":"Unlock the Full Classroom Experience","valuePropositions":["Full Coding Curriculum","Ad-free environment","Student progress tracking"]},"school-admin":{"headline":"Your School''s Ad-Free Quote","valuePropositions":["100%% Ad-Free Walled Garden","Unlimited Data Retention","School-wide SSO"]},"district-admin":{"headline":"Your District Implementation Roadmap","valuePropositions":["100%% Ad-Free Walled Garden","Signed DPA Compliance","District Master Dashboard"]}}},"label":"Plus Paywall","code":"PAY-PLUS","isValid":true,"isSelected":false,"isHighlighted":false}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 3.1: Append Edges 0 to 5
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator School Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{edges}', (data->'edges') || '[{"id":"e-DM1bMZPn1141syRYP0as0-1Ds-OqEoxdvr-XiroJx-2","source":"DM1bMZPn1141syRYP0as0","target":"1Ds-OqEoxdvr-XiroJx-2","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-1Ds-OqEoxdvr-XiroJx-2-1O2Gy7NlHNaHAXe1liHUH","source":"1Ds-OqEoxdvr-XiroJx-2","target":"1O2Gy7NlHNaHAXe1liHUH","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-1O2Gy7NlHNaHAXe1liHUH-jBIoiMCCoIenCIPYM_VId","source":"1O2Gy7NlHNaHAXe1liHUH","target":"jBIoiMCCoIenCIPYM_VId","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-jBIoiMCCoIenCIPYM_VId-S-hlytg9iwjDRNqcaP43n","source":"jBIoiMCCoIenCIPYM_VId","target":"S-hlytg9iwjDRNqcaP43n","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-S-hlytg9iwjDRNqcaP43n-FQ2LaxPiGVteE6Gcd4Jw1","source":"S-hlytg9iwjDRNqcaP43n","target":"FQ2LaxPiGVteE6Gcd4Jw1","type":"smoothstep","animated":true,"data":{"isDefault":true}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 3.2: Append Edges 5 to 10
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator School Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{edges}', (data->'edges') || '[{"id":"e-FQ2LaxPiGVteE6Gcd4Jw1-aVVpauWWk_2fLJ1vwE-Eh","source":"FQ2LaxPiGVteE6Gcd4Jw1","target":"aVVpauWWk_2fLJ1vwE-Eh","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-aVVpauWWk_2fLJ1vwE-Eh-ZZc2n9fAGd9zXSnXlsgyi","source":"aVVpauWWk_2fLJ1vwE-Eh","target":"ZZc2n9fAGd9zXSnXlsgyi","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-ZZc2n9fAGd9zXSnXlsgyi-NHFU5EBkEN06vE1pUKBhV","source":"ZZc2n9fAGd9zXSnXlsgyi","target":"NHFU5EBkEN06vE1pUKBhV","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-NHFU5EBkEN06vE1pUKBhV-p2sY7XWB3bcLL8xY9rvVg","source":"NHFU5EBkEN06vE1pUKBhV","target":"p2sY7XWB3bcLL8xY9rvVg","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-p2sY7XWB3bcLL8xY9rvVg-piEg42HPSJyYFSLUPt6dL","source":"p2sY7XWB3bcLL8xY9rvVg","target":"piEg42HPSJyYFSLUPt6dL","type":"smoothstep","animated":true,"data":{"isDefault":true}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 3.3: Append Edges 10 to 15
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator School Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{edges}', (data->'edges') || '[{"id":"e-piEg42HPSJyYFSLUPt6dL-SKEy5_t1ZF8ZskyISdpvU","source":"piEg42HPSJyYFSLUPt6dL","target":"SKEy5_t1ZF8ZskyISdpvU","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-SKEy5_t1ZF8ZskyISdpvU-JzyR6y_LyE-Mjcmp9JFKY","source":"SKEy5_t1ZF8ZskyISdpvU","target":"JzyR6y_LyE-Mjcmp9JFKY","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-JzyR6y_LyE-Mjcmp9JFKY-6N9MxPYeU2EhCbkYFKxIV","source":"JzyR6y_LyE-Mjcmp9JFKY","target":"6N9MxPYeU2EhCbkYFKxIV","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-9B7w1CrzoTvvLfPSpT3MB-s3soYl-XjyLlCGXmdx-XI","source":"9B7w1CrzoTvvLfPSpT3MB","target":"s3soYl-XjyLlCGXmdx-XI","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-s3soYl-XjyLlCGXmdx-XI-Ut6IZ0qxn_wULRkCer7RY","source":"s3soYl-XjyLlCGXmdx-XI","target":"Ut6IZ0qxn_wULRkCer7RY","type":"smoothstep","animated":true,"data":{"isDefault":true}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 3.4: Append Edges 15 to 20
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator School Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{edges}', (data->'edges') || '[{"id":"e-Ut6IZ0qxn_wULRkCer7RY-r9dIQcb1Ctu1nNYNkCpte","source":"Ut6IZ0qxn_wULRkCer7RY","target":"r9dIQcb1Ctu1nNYNkCpte","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-r9dIQcb1Ctu1nNYNkCpte-RlEKGCyonqa99fqSs9C1-","source":"r9dIQcb1Ctu1nNYNkCpte","target":"RlEKGCyonqa99fqSs9C1-","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-RlEKGCyonqa99fqSs9C1--FyWi5Rp4fjvPSV4ijlOhe","source":"RlEKGCyonqa99fqSs9C1-","target":"FyWi5Rp4fjvPSV4ijlOhe","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-FyWi5Rp4fjvPSV4ijlOhe-TAZDoihTR7piX4NMVVrT4","source":"FyWi5Rp4fjvPSV4ijlOhe","target":"TAZDoihTR7piX4NMVVrT4","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-TAZDoihTR7piX4NMVVrT4-bSg3TrgXMJyxvcTCL9uSm","source":"TAZDoihTR7piX4NMVVrT4","target":"bSg3TrgXMJyxvcTCL9uSm","type":"smoothstep","animated":true,"data":{"isDefault":true}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 3.5: Append Edges 20 to 22
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator School Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flow_versions
  SET data = jsonb_set(data, '{edges}', (data->'edges') || '[{"id":"e-bSg3TrgXMJyxvcTCL9uSm-QXL1VdLGkpF6O3v7FufEs","source":"bSg3TrgXMJyxvcTCL9uSm","target":"QXL1VdLGkpF6O3v7FufEs","type":"smoothstep","animated":true,"data":{"isDefault":true}},{"id":"e-6N9MxPYeU2EhCbkYFKxIV-9B7w1CrzoTvvLfPSpT3MB-opt-yes","source":"6N9MxPYeU2EhCbkYFKxIV","target":"9B7w1CrzoTvvLfPSpT3MB","sourceHandle":"opt-yes","type":"smoothstep","animated":true,"label":"Yes","data":{"label":"Yes"}}]'::jsonb)
  WHERE id = v_id;
END $$;

-- STEP 4: Set Current Version
DO $$
DECLARE
  f_id uuid;
  v_id uuid;
BEGIN
  SELECT id INTO f_id FROM flows WHERE name = 'Educator School Admin' ORDER BY created_at DESC LIMIT 1;
  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;
  UPDATE flows SET current_version_id = v_id WHERE id = f_id;
END $$;

