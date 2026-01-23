import { supabase } from "@/lib/supabase/client";
import { Screen } from "@/types/flow";

export interface ComponentOverride {
    component_code: string;
    overrides: Partial<Screen>;
}

export const sharedComponentService = {
    /**
     * Fetch overrides for a list of component codes
     */
    async fetchOverrides(componentCodes: string[]): Promise<ComponentOverride[]> {
        if (componentCodes.length === 0) return [];

        const { data, error } = await supabase
            .from("component_overrides")
            .select("component_code, overrides")
            .in("component_code", componentCodes);

        if (error) {
            console.error("Error fetching component overrides:", error);
            return [];
        }

        return data.map((row) => ({
            component_code: row.component_code,
            overrides: row.overrides as unknown as Partial<Screen>,
        }));
    },

    /**
     * Save an override for a component
     * effectively making this configuration the global default for this component type
     */
    async saveOverride(componentCode: string, overrides: Partial<Screen>): Promise<void> {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        // We need the org ID. Usually this is cached or available in context,
        // but for safety we'll fetch it from the profile if we don't have a better way.
        // Ideally, the backend would handle this via a trigger or default, but RLS policies
        // require the organization_id to be present in the insert.

        // Quick lookup for org id
        const { data: profile } = await supabase
            .from("profiles")
            .select("organization_id")
            .eq("id", userData.user.id)
            .single();

        if (!profile?.organization_id) {
            console.error("Cannot save override: User has no organization");
            return;
        }

        const { error } = await supabase
            .from("component_overrides")
            .upsert(
                {
                    organization_id: profile.organization_id,
                    component_code: componentCode,
                    overrides: overrides as any,
                    updated_at: new Date().toISOString(),
                    updated_by: userData.user.id,
                },
                {
                    onConflict: "organization_id, component_code",
                }
            );

        if (error) {
            console.error("Error saving component override:", error);
            throw error;
        }
    },

    /**
     * Fetch Library Snapshots (Metadata + Default Props)
     */
    async fetchLibraryItems(): Promise<{ component_code: string; label: string; description: string; icon: string; default_props: Partial<Screen> }[]> {
        const { data, error } = await supabase
            .from("library_items")
            .select("component_code, label, description, icon, default_props");

        if (error) {
            // It's possible the table is empty or RLS prevents access if no org, fail gracefully
            console.warn("Error fetching library items:", error);
            return [];
        }
        return (data || []).map(item => ({
            component_code: item.component_code,
            label: item.label || "",
            description: item.description || "",
            icon: item.icon || "help-circle",
            default_props: item.default_props as unknown as Partial<Screen>
        }));
    },

    /**
     * Save/Update a Library Snapshot
     * This pushes the current state of a node to be the new "Default" in the sidebar.
     */
    async saveLibraryItem(code: string, label: string, description: string, icon: string, defaultProps: Partial<Screen>): Promise<void> {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const { data: profile } = await supabase
            .from("profiles")
            .select("organization_id")
            .eq("id", userData.user.id)
            .single();

        if (!profile?.organization_id) return;

        const payload = {
            organization_id: profile.organization_id,
            component_code: code,
            label,
            description,
            icon,
            default_props: defaultProps as any,
            updated_at: new Date().toISOString(),
            updated_by: userData.user.id
        };

        const { error } = await supabase
            .from("library_items")
            .upsert(payload, { onConflict: "organization_id, component_code" });

        if (error) {
            console.error("Error saving library item:", error);
            throw error;
        }
    },

    /**
     * Find which flows are using a specific component code
     */
    async findComponentUsage(componentCode: string): Promise<{ flowId: string, flowName: string }[]> {
        // Strategy: Fetch all flows and their current versions, then filter in memory.
        // This avoids complex/brittle JSONB filtering in Postgres.

        // 1. Get all flows
        const { data: flows, error: flowsError } = await supabase
            .from("flows")
            .select("id, name, current_version_id");

        if (flowsError || !flows) {
            console.error("Error fetching flows for usage check:", flowsError);
            return [];
        }

        const validFlows = flows.filter(f => f.current_version_id);
        const versionIds = validFlows.map(f => f.current_version_id);

        if (versionIds.length === 0) return [];

        // 2. Fetch version data for all active versions
        const { data: versions, error: versionsError } = await supabase
            .from("flow_versions")
            .select("id, data")
            .in("id", versionIds);

        if (versionsError || !versions) {
            console.error("Error fetching versions for usage check:", versionsError);
            return [];
        }

        // 3. Map version data back to flows and check for usage
        const usage: { flowId: string, flowName: string }[] = [];

        for (const flow of validFlows) {
            const version = versions.find(v => v.id === flow.current_version_id);
            if (!version || !version.data) continue;

            const screens = (version.data as any).screens || [];
            if (Array.isArray(screens)) {
                // Check if any screen has the matching component code
                const hasUsage = screens.some((s: any) => s.componentCode === componentCode);
                if (hasUsage) {
                    usage.push({
                        flowId: flow.id,
                        flowName: flow.name
                    });
                }
            }
        }

        return usage;
    }
};
