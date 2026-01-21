import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { blueprints } from "../data/blueprints";
import { hydrateFlow } from "../lib/flowHydrator";
import { Database } from "../types/supabase";

// Load environment variables locally
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// We need a specific user ID to act as "Creator" for the seed data.
// Since we don't have a service key in .env, we have to rely on Anon key RLS.
// This is tricky: Anon key usually can't insert into `flows` unless it's an authenticated user 
// who is a "member" of the org.
//
// BUT: We enabled "Editor/Admin can create flows".
//
// OPTION A: Hardcode a "System User" token? No.
// OPTION B: Ask the user to login first? No.
// OPTION C: We inserted the org via SQL directly. We can insert the flows via SQL directly too?
//
// DECISION: Yes, doing this via client-side libraries in a "script" without a Service Role key is hard 
// because RLS will block us unless we have a user session.
// 
// I will output the SQL to valid Insert Statements that can be run via execute_sql.
// This is safer and bypasses RLS issues for this one-time seed.

const filterKey = process.argv[2]; // e.g. "educator-teacher"

// console.log("-- SQL Seed for " + (filterKey || "ALL"));

const ESCAPE = (str: string) => str.replace(/'/g, "''").replace(/%/g, "%%");

Object.entries(blueprints).forEach(([key, componentCodes]) => {
    if (filterKey && key !== filterKey) return;

    const flowName = key
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    const hydrated = hydrateFlow(componentCodes);
    const jsonPayload = JSON.stringify(hydrated);

    // console.log(`-- Flow: ${flowName}`);
    console.log(`DO $$`);
    console.log(`DECLARE`);
    console.log(`  org_id uuid;`);
    console.log(`  profile_id uuid;`);
    console.log(`  new_flow_id uuid;`);
    console.log(`  version_id uuid;`);
    console.log(`BEGIN`);
    console.log(`  -- Get IDs`);
    console.log(`  SELECT id INTO org_id FROM organizations WHERE slug = 'teaching-com';`);
    console.log(`  SELECT id INTO profile_id FROM profiles WHERE organization_id = org_id LIMIT 1;`);
    console.log(``);
    console.log(`  -- Insert Flow`);
    console.log(`  INSERT INTO flows (organization_id, name, description, created_by)`);
    console.log(`  VALUES (org_id, '${ESCAPE(flowName)}', 'Imported from Blueprint', profile_id)`);
    console.log(`  RETURNING id INTO new_flow_id;`);
    console.log(``);
    console.log(`  -- Insert Version`);
    console.log(`  INSERT INTO flow_versions (flow_id, version_name, data, created_by)`);
    console.log(`  VALUES (new_flow_id, 'Initial Seed', '${ESCAPE(jsonPayload)}'::jsonb, profile_id)`);
    console.log(`  RETURNING id INTO version_id;`);
    console.log(``);
    console.log(`  -- Update Current`);
    console.log(`  UPDATE flows SET current_version_id = version_id WHERE id = new_flow_id;`);
    console.log(`END $$;`);
    console.log(``);
});
