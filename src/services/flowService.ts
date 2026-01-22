import { supabase } from "@/lib/supabase/client";
import { Flow, FlowCategory, TargetPortal } from "@/types/flow";
import { Json } from "@/types/supabase";

export interface FlowSummary {
    id: string;
    name: string;
    description: string | null;
    updatedAt: string;
    currentVersionId: string | null;
    unreadCount: number;
    totalCommentCount: number;
}

export const flowService = {
    // Fetch all flows visible to the user (RLS will filter by organization)
    async fetchFlows(): Promise<FlowSummary[]> {
        const { data: flows, error } = await supabase
            .from("flows")
            .select("id, name, description, updated_at, current_version_id")
            .order("updated_at", { ascending: false });

        if (error) {
            console.error("Error fetching flows:", error);
            throw error;
        }

        // Fetch stats from improved view
        const { data: statsData } = await supabase
            .from("flow_dashboard_stats" as any)
            .select("flow_id, total_open_comments, unread_count");

        const statsMap = new Map<string, { unread: number, total: number }>();
        statsData?.forEach((item: any) => {
            statsMap.set(item.flow_id, {
                unread: item.unread_count,
                total: item.total_open_comments
            });
        });

        return flows.map((flow) => {
            const stats = statsMap.get(flow.id) || { unread: 0, total: 0 };
            return {
                id: flow.id,
                name: flow.name,
                description: flow.description,
                updatedAt: flow.updated_at || new Date().toISOString(),
                currentVersionId: flow.current_version_id,
                unreadCount: stats.unread,
                totalCommentCount: stats.total,
            };
        });
    },

    // Fetch a specific flow and its latest version data
    async fetchFlow(flowId: string): Promise<Flow | null> {
        // 1. Get flow metadata
        const { data: flowData, error: flowError } = await supabase
            .from("flows")
            .select("*")
            .eq("id", flowId)
            .single();

        if (flowError) {
            console.error("Error fetching flow metadata:", flowError);
            throw flowError;
        }

        if (!flowData.current_version_id) {
            console.warn("Flow has no current version:", flowId);
            return null;
        }

        // 2. Get version data
        const { data: versionData, error: versionError } = await supabase
            .from("flow_versions")
            .select("data")
            .eq("id", flowData.current_version_id)
            .single();

        if (versionError) {
            console.error("Error fetching flow version:", versionError);
            throw versionError;
        }

        // 3. Hydrate Flow object
        const storedData = versionData.data as unknown as Partial<Flow>;

        // Merge stored data with fresh metadata to ensure sync
        const flow: Flow = {
            ...storedData,
            id: flowData.id,
            name: flowData.name,
            description: flowData.description || "",
            // Default to stored values or fallbacks if missing
            category: (storedData.category as FlowCategory) || "individual",
            targetPortal: (storedData.targetPortal as TargetPortal) || "student",
            version: storedData.version || "1.0.0",
            createdAt: flowData.created_at || new Date().toISOString(),
            updatedAt: flowData.updated_at || new Date().toISOString(),
            // Ensure arrays are initialized
            screens: storedData.screens || [],
            variables: storedData.variables || [],
            settings: storedData.settings || {
                showProgressBar: true,
                progressBarStyle: "steps",
                allowBackNavigation: true,
                autoSaveResponses: true,
                theme: "default"
            },
            // Ensure entryScreenId is string
            entryScreenId: storedData.entryScreenId || ""
        } as Flow;

        return flow;
    },

    // Save flow as a new version
    async saveFlow(flow: Flow): Promise<void> {
        // 1. Create new version
        const versionData: Json = JSON.parse(JSON.stringify(flow)); // Ensure clean JSON

        // We don't store the ID/metadata in the JSON blob typically, or we do as a snapshot.
        // For now, we store the whole Flow object as the snapshot.

        const { data: version, error: versionError } = await supabase
            .from("flow_versions")
            .insert({
                flow_id: flow.id,
                data: versionData,
                version_name: `v${Date.now()}` // Simple version naming
            })
            .select("id")
            .single();

        if (versionError) {
            console.error("Error creating flow version:", versionError);
            throw versionError;
        }

        // 2. Update flow metadata and point to new version
        const { error: flowError } = await supabase
            .from("flows")
            .update({
                name: flow.name,
                description: flow.description,
                current_version_id: version.id,
                updated_at: new Date().toISOString()
            })
            .eq("id", flow.id);

        if (flowError) {
            console.error("Error updating flow metadata:", flowError);
            throw flowError;
        }
    },

    // Create a NEW flow in the database
    async createFlow(flow: Flow): Promise<string> {
        // 1. Get user profile to find organization_id
        const userResponse = await supabase.auth.getUser();
        console.log("createFlow: getUser response:", userResponse);

        const userId = userResponse.data.user?.id;

        if (!userId) {
            console.error("createFlow: User not authenticated. Error:", userResponse.error);
            throw new Error(`User not authenticated: ${userResponse.error?.message || "No session"}`);
        }

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("organization_id")
            .eq("id", userId)
            .single();

        if (profileError || !profile) {
            throw new Error("Could not fetch user profile for organization lookup");
        }

        if (!profile.organization_id) {
            throw new Error("User does not belong to an organization. Cannot create flow.");
        }

        // 2. Insert into flows table
        const { data: newFlow, error: createError } = await supabase
            .from("flows")
            .insert({
                name: flow.name,
                description: flow.description || "Created via Editor",
                organization_id: profile.organization_id,
                is_locked: false
            })
            .select("id")
            .single();

        if (createError) {
            console.error("Error creating flow:", createError);
            throw createError;
        }

        // 3. Create initial version
        // We must update the flow ID in the data blob to match the DB ID
        const initialFlowState = { ...flow, id: newFlow.id };
        const versionData: Json = JSON.parse(JSON.stringify(initialFlowState));

        const { data: version, error: versionError } = await supabase
            .from("flow_versions")
            .insert({
                flow_id: newFlow.id,
                data: versionData,
                version_name: "Initial Version"
            })
            .select("id")
            .single();

        if (versionError) {
            // Try to cleanup? For now just throw
            console.error("Error creating initial version:", versionError);
            throw versionError;
        }

        // 4. Update flow to point to current version
        await supabase
            .from("flows")
            .update({ current_version_id: version.id })
            .eq("id", newFlow.id);

        return newFlow.id;
    }
};
