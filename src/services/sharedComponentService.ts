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
};
