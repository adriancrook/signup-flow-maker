import { Flow, Screen } from "@/types/flow";
import { componentRegistry } from "@/data/componentRegistry";

export const LinkMigrationService = {
    /**
     * Scans a flow's nodes and attempts to auto-link "orphan" nodes 
     * to their matching Library Master Definition.
     * 
     * Returns a list of changes made (nodeId -> newComponentCode)
     * or null if no changes needed.
     */
    migrateFlow(flow: Flow): { hasChanges: boolean; migratedNodes: number } {
        let migratedNodes = 0;
        let hasChanges = false;

        // Create a quick lookup map for registry items
        // Key = Type + Title (normalized) -> Code
        // We also fallback to just Type if it's a unique type like "GATEKEEPER" (maybe?)
        // For now, let's stick to strict Type + Title matching to avoid bad links.
        const registryMap = new Map<string, string>();

        componentRegistry.forEach(template => {
            if (!template.defaultScreen) return;
            const key = `${template.defaultScreen.type}:${template.defaultScreen.title}`.toLowerCase();
            registryMap.set(key, template.code);
        });

        flow.screens.forEach(screen => {
            // 1. Skip if already linked
            if (screen.componentCode) return;

            // 2. Generate lookup key
            const key = `${screen.type}:${screen.title}`.toLowerCase();

            // 3. Check for match
            const matchedCode = registryMap.get(key);
            if (matchedCode) {
                // MATCH FOUND! Auto-link it.
                console.log(`[LinkMigration] Auto-linking Node [${screen.id}] "${screen.title}" -> ${matchedCode}`);
                screen.componentCode = matchedCode;
                hasChanges = true;
                migratedNodes++;
            }
        });

        return { hasChanges, migratedNodes };
    }
};
