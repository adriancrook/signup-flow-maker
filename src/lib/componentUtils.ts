import { ComponentTemplate, FlowCategory } from "@/types/flow";

interface ComponentAvailability {
    isShared: boolean;
    validFlows: string[]; // "all", "individual", "educator", or specific
    validRoles: string[]; // derived from tags
}

export function getComponentAvailability(template: ComponentTemplate): ComponentAvailability {
    const isShared = template.isShared;
    const validFlows: string[] = [];

    if (template.validFlows) {
        validFlows.push(...template.validFlows);
    } else if (isShared) {
        validFlows.push("all");
    } else {
        // If not shared and no validFlows specified, infer from tags
        if (template.tags.some(t => ["student", "parent", "adult"].includes(t))) {
            validFlows.push("individual");
        }
        if (template.tags.some(t => ["teacher", "school-admin", "district-admin", "educator", "district"].includes(t))) {
            validFlows.push("educator");
        }
    }

    // Derive granular roles from tags
    const knownRoles = [
        "student",
        "parent",
        "adult",
        "teacher",
        "school-admin",
        "district-admin",
        "district", // alias for district-admin sometimes
        "educator" // generic
    ];

    const validRoles = template.tags.filter(tag => knownRoles.includes(tag));

    return {
        isShared,
        validFlows: Array.from(new Set(validFlows)),
        validRoles
    };
}
