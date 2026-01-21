import { Node, Edge } from "@xyflow/react";
import { componentRegistry } from "../data/componentRegistry";
import { ComponentCode, Screen } from "../types/flow";
import { nanoid } from "nanoid";
import { getGridLayoutElements } from "./autoLayout";

// We use dagre for layout calculation via getLayoutedElements

interface HydratedFlow {
    nodes: Node[];
    edges: Edge[];
}

export const hydrateFlow = (blueprint: ComponentCode[]): HydratedFlow => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    blueprint.forEach((code, index) => {
        // 1. Find template
        // We strip the Variant suffix if needed, but registry is flattened now so exact match is best.
        // If not found, check if it's a generic code (e.g. MC-PURPOSE might be the ID for MC-PURPOSE-STU)
        // For now, we assume precise mapping in registry or we do a lookup.

        // Our registry uses "code" property.
        // Our registry uses "code" property which is often just [TYPE]-[SLUG].
        // Blueprints use [TYPE]-[SLUG]-[VARIANT]. We need to handle this.
        let template = componentRegistry.find((c) => c.code === code);

        if (!template) {
            // Try stripping the last segment (Variant)
            const parts = code.split('-');
            if (parts.length > 2) {
                const baseCode = parts.slice(0, parts.length - 1).join('-');
                template = componentRegistry.find((c) => c.code === baseCode);
            }
        }

        if (!template) {
            console.warn(`Blueprint code not found in registry: ${code}`);
            return;
        }

        const nodeId = nanoid();

        // Construct the Screen object first
        const screenData: any = {
            id: nodeId,
            ...template.defaultScreen,
            // Ensure type is uppercase as per registry
            type: template.defaultScreen.type || "default",
        };

        // 2. Create Node
        const node: Node = {
            id: nodeId,
            type: template.defaultScreen.type || "default", // e.g. "MC", "MSG"
            position: { x: 0, y: index * 200 }, // Vertical layout placeholder
            data: {
                screen: screenData,
                label: template.name,
                code: template.code,
                isValid: true,
                isSelected: false,
                isHighlighted: false,
            },
        };

        nodes.push(node);

        // 3. Create Edge to previous node
        if (nodes.length > 1) {
            const prevNode = nodes[nodes.length - 2];
            const edge: Edge = {
                id: `e-${prevNode.id}-${nodeId}`,
                source: prevNode.id,
                target: nodeId,
                type: 'smoothstep',
                animated: true,
                data: { isDefault: true },
            };
            edges.push(edge);
        }
    });

    // 4. Post-processing: Resolve "CODE:" references in options and create branches
    nodes.forEach((node) => {
        const screen = node.data.screen as any;
        if (screen.options && Array.isArray(screen.options)) {
            screen.options.forEach((option: any) => {
                if (option.nextScreenId && option.nextScreenId.startsWith("CODE:")) {
                    const targetCode = option.nextScreenId.replace("CODE:", "");

                    // Find the target node AFTER the current node to prefer forward progress
                    // But technically we search all nodes.
                    // Let's use simple find for now.
                    const targetNode = nodes.find(n => n.data.code === targetCode);

                    if (targetNode) {
                        // Check for existing default edge between these nodes
                        const defaultEdgeIndex = edges.findIndex(e =>
                            e.source === node.id &&
                            e.target === targetNode.id &&
                            e.data?.isDefault
                        );

                        // If we find a default edge connecting these same two nodes, remove it
                        // This allows the specific option-handle edge to take precedence visually
                        if (defaultEdgeIndex !== -1) {
                            edges.splice(defaultEdgeIndex, 1);
                        }

                        // 1. Resolve the ID in the screen data for the runtime
                        option.nextScreenId = targetNode.id;

                        // 2. Create the visual edge
                        const edge: Edge = {
                            id: `e-${node.id}-${targetNode.id}-${option.id}`,
                            source: node.id,
                            target: targetNode.id,
                            sourceHandle: option.id,
                            type: 'smoothstep',
                            animated: true,
                            label: option.label,
                            data: { label: option.label }
                        };
                        edges.push(edge);
                    } else {
                        console.warn(`Could not resolve CODE link: ${targetCode}`);
                    }
                }
            });
        }
    });

    // Apply auto-layout before returning
    const layouted = getGridLayoutElements(nodes, edges, 4);
    return { nodes: layouted.nodes, edges: layouted.edges };
};
