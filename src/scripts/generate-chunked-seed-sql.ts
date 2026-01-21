import { blueprints } from "../data/blueprints";
import { hydrateFlow } from "../lib/flowHydrator";

// Helper to escape single quotes (and % if needed, though we'll rely on small chunks now)
const ESCAPE = (str: string) => str.replace(/'/g, "''").replace(/%/g, "%%");

const filterKey = process.argv[2];

Object.entries(blueprints).forEach(([key, componentCodes]) => {
    if (filterKey && key !== filterKey) return;

    const flowName = key.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const hydrated = hydrateFlow(componentCodes);

    // Split nodes and edges
    const nodes = hydrated.nodes;
    const edges = hydrated.edges;

    // Chunk size
    const CHUNK_SIZE = 5;

    console.log(`-- ==========================================`);
    console.log(`-- Flow: ${flowName}`);
    console.log(`-- ==========================================`);

    // STEP 1: Insert Flow and Empty Version
    console.log(`-- STEP 1: Init Flow`);
    console.log(`DO $$`);
    console.log(`DECLARE`);
    console.log(`  org_id uuid;`);
    console.log(`  profile_id uuid;`);
    console.log(`  new_flow_id uuid;`);
    console.log(`  version_id uuid;`);
    console.log(`BEGIN`);
    console.log(`  SELECT id INTO org_id FROM organizations WHERE slug = 'teaching-com';`);
    console.log(`  SELECT id INTO profile_id FROM profiles WHERE organization_id = org_id LIMIT 1;`);
    console.log(``);
    console.log(`  -- Create or Get Flow`);
    console.log(`  INSERT INTO flows (organization_id, name, description, created_by)`);
    console.log(`  VALUES (org_id, '${ESCAPE(flowName)}', 'Imported (Chunked)', profile_id)`);
    console.log(`  RETURNING id INTO new_flow_id;`);
    console.log(``);
    console.log(`  -- Create Initial Empty Version`);
    console.log(`  INSERT INTO flow_versions (flow_id, version_name, data, created_by)`);
    console.log(`  VALUES (new_flow_id, 'Initial Seed', '{"nodes": [], "edges": []}'::jsonb, profile_id);`);
    console.log(`END $$;`);
    console.log(``);

    // STEP 2: Insert Nodes in Chunks
    for (let i = 0; i < nodes.length; i += CHUNK_SIZE) {
        const chunk = nodes.slice(i, i + CHUNK_SIZE);
        const chunkJson = JSON.stringify(chunk);

        console.log(`-- STEP 2.${(i / CHUNK_SIZE) + 1}: Append Nodes ${i} to ${i + chunk.length}`);
        console.log(`DO $$`);
        console.log(`DECLARE`);
        console.log(`  f_id uuid;`);
        console.log(`  v_id uuid;`);
        console.log(`BEGIN`);
        console.log(`  SELECT id INTO f_id FROM flows WHERE name = '${ESCAPE(flowName)}' ORDER BY created_at DESC LIMIT 1;`);
        console.log(`  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;`);
        console.log(`  UPDATE flow_versions`);
        console.log(`  SET data = jsonb_set(data, '{nodes}', (data->'nodes') || '${ESCAPE(chunkJson)}'::jsonb)`);
        console.log(`  WHERE id = v_id;`);
        console.log(`END $$;`);
        console.log(``);
    }

    // STEP 3: Insert Edges (All at once usually fine, or chunk if needed)
    // Edges are small, usually. But let's verify. 11KB total file, edges are maybe 2-3KB? 
    // Let's chunk edges too just to be safe.
    for (let i = 0; i < edges.length; i += CHUNK_SIZE) {
        const chunk = edges.slice(i, i + CHUNK_SIZE);
        const chunkJson = JSON.stringify(chunk);

        console.log(`-- STEP 3.${(i / CHUNK_SIZE) + 1}: Append Edges ${i} to ${i + chunk.length}`);
        console.log(`DO $$`);
        console.log(`DECLARE`);
        console.log(`  f_id uuid;`);
        console.log(`  v_id uuid;`);
        console.log(`BEGIN`);
        console.log(`  SELECT id INTO f_id FROM flows WHERE name = '${ESCAPE(flowName)}' ORDER BY created_at DESC LIMIT 1;`);
        console.log(`  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;`);
        console.log(`  UPDATE flow_versions`);
        console.log(`  SET data = jsonb_set(data, '{edges}', (data->'edges') || '${ESCAPE(chunkJson)}'::jsonb)`);
        console.log(`  WHERE id = v_id;`);
        console.log(`END $$;`);
        console.log(``);
    }

    // STEP 4: Set Current Version
    console.log(`-- STEP 4: Set Current Version`);
    console.log(`DO $$`);
    console.log(`DECLARE`);
    console.log(`  f_id uuid;`);
    console.log(`  v_id uuid;`);
    console.log(`BEGIN`);
    console.log(`  SELECT id INTO f_id FROM flows WHERE name = '${ESCAPE(flowName)}' ORDER BY created_at DESC LIMIT 1;`);
    console.log(`  SELECT id INTO v_id FROM flow_versions WHERE flow_id = f_id ORDER BY created_at DESC LIMIT 1;`);
    console.log(`  UPDATE flows SET current_version_id = v_id WHERE id = f_id;`);
    console.log(`END $$;`);
    console.log(``);
});
