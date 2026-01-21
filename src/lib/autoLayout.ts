import { Node, Edge } from '@xyflow/react';

export const getGridLayoutElements = (nodes: Node[], edges: Edge[], columns = 4) => {
    const NODE_WIDTH = 360;
    const ROW_HEIGHT = 320;

    const layoutedNodes = nodes.map((node, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);

        return {
            ...node,
            position: {
                x: col * NODE_WIDTH,
                y: row * ROW_HEIGHT,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};
