import { ComponentTemplate, FlowCategory } from "@/types/flow";

interface ComponentAvailability {
    isShared: boolean;
    validFlows: string[]; // "all", "individual", "educator", or specific
    validRoles: string[]; // derived from tags
}

export function getComponentAvailability(template: ComponentTemplate): ComponentAvailability {
    const isShared = template.isShared;
    const validFlows: string[] = [];

    // 1. Flow Inference
    if (template.validFlows) {
        validFlows.push(...template.validFlows);
    } else {
        // Infer from tags
        // Individual Flow Tags
        if (template.tags.some(t => ["student", "parent", "adult", "individual"].includes(t))) {
            validFlows.push("individual");
        }
        // Educator Flow Tags
        if (template.tags.some(t => ["teacher", "school-admin", "district-admin", "educator", "district", "admin"].includes(t))) {
            validFlows.push("educator");
        }

        // If no specific flow tags found, default to ALL (e.g. generic components like Sticky Note)
        if (validFlows.length === 0) {
            validFlows.push("all");
        }
    }

    // Derive granular roles from tags
    // 2. Role Inference with Meta-Role Expansion
    const knownRoles = [
        "student", "parent", "adult",
        "teacher", "school-admin", "district-admin",
        "district", "educator", "admin", "individual"
    ];

    // Start with explicit tags that match known roles
    const computedRoles = template.tags.filter(tag => knownRoles.includes(tag));

    // Expand Meta-Roles
    if (template.tags.includes("educator")) {
        computedRoles.push("teacher", "school-admin", "district-admin");
    }
    if (template.tags.includes("individual")) {
        computedRoles.push("student", "parent", "adult");
    }
    if (template.tags.includes("admin")) { // "admin" usually implies school + district
        computedRoles.push("school-admin", "district-admin");
    }
    if (template.tags.includes("district")) { // alias
        computedRoles.push("district-admin");
    }

    // Deduplicate roles and filter to meaningful "Leaf Roles" for cross-role check
    const uniqueRoles = Array.from(new Set(computedRoles));
    const leafRoles = ["student", "parent", "adult", "teacher", "school-admin", "district-admin"];
    const activeLeafRoles = uniqueRoles.filter(r => leafRoles.includes(r));

    // Dynamic Shared Logic
    // 1. Has role variants?
    const hasVariants = template.defaultScreen &&
        'variants' in template.defaultScreen &&
        template.defaultScreen.variants &&
        Object.keys(template.defaultScreen.variants).length > 0;

    // 2. Used in multiple flow types? (e.g. Individual AND Educator, or "all")
    const isCrossFlow = validFlows.includes("all") || validFlows.length > 1;

    // 3. Used by multiple roles within a flow? (e.g. Teacher AND Admin)
    const isCrossRole = activeLeafRoles.length > 1;

    // A component is "visually shared" if it has variants OR is used across boundaries
    const isVisuallyShared = hasVariants || isCrossFlow || isCrossRole;

    return {
        isShared: isVisuallyShared,
        validFlows: Array.from(new Set(validFlows)),
        validRoles: uniqueRoles
    };
}
