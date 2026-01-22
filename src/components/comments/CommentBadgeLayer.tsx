import React from 'react';
import { FlowNode } from '@/store/editorStore';
import { Database } from '@/types/supabase';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';

type Comment = Database['public']['Tables']['comments']['Row'];

interface CommentBadgeLayerProps {
    nodes: FlowNode[];
    comments: Comment[];
    lastViewedAt: string | null;
    onNodeClick: (nodeId: string) => void;
}

export function CommentBadgeLayer({ nodes, comments, lastViewedAt, onNodeClick }: CommentBadgeLayerProps) {
    // Calculate badges
    const nodeBadges = React.useMemo(() => {
        const badges: Record<string, { count: number; hasUnread: boolean }> = {};

        // Group comments by node_id
        comments.forEach(comment => {
            if (!comment.node_id) return;
            if (comment.status === 'RESOLVED') return; // Don't badge resolved? or maybe just count them separately?
            // Spec says: "Total Comment Count" and "Red Dot if unread"

            if (!badges[comment.node_id]) {
                badges[comment.node_id] = { count: 0, hasUnread: false };
            }

            badges[comment.node_id].count++;

            const isUnread = !lastViewedAt || new Date(comment.created_at || "") > new Date(lastViewedAt);
            if (isUnread) {
                badges[comment.node_id].hasUnread = true;
            }
        });

        return badges;
    }, [comments, lastViewedAt]);

    if (nodes.length === 0) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" style={{ width: '100%', height: '100%' }}>
            {/* 
               We need to render badges at node positions. 
               However, nodes move with the viewport (pan/zoom).
               React Flow handles the viewport transform for nodes.
               If we put this layer *inside* React Flow as a custom layer? 
               Or assume this component is rendered inside the React Flow viewport?
               
               Actually, the best way to do badges on nodes is to use a Custom Node wrapper OR 
               render them inside the ReactFlow component but as an "Edge Label" or similar?
               
               Wait, React Flow allows valid HTML overlays if we use <Panel> or just absolute div IF we know the transform.
               
               Easiest approach:
               Actually, the `FlowCanvas` renders `ReactFlow`. 
               To stick to nodes, we can use the `NodeToolbar` or just a regular `div` inside a custom Node?
               But modifying *every* node type to include Badge logic is intrusive.
               
               Alternative: "Overlay" using React Flow's coordinate system.
               We can use `useReactFlow` to project positions? 
               But performance is tricky during pan.
               
               Better Approach: Update the NodeRenderer? 
               Or... simple absolute positioning if we are *inside* the <ReactFlow> component as children?
               React Flow children are rendered in the *viewport*? No, typically mostly Panels/Controls.
               
               Let's try rendering a list of divs with `transform` derived from node position? 
               Ah, React Flow 12+ has `NodeToolbar`.
               But we want it always visible, not just on selection.
               
               Let's try "Node Layers" approach? 
               Actually, maybe just modifying the Node Types in `index.ts` to wrap them with a "BadgeAwareNode"?
               That ensures they move correctly. 
               
               Let's try wrapping the existing node types.
            */}
        </div>
    );
}

// Re-thinking: Wrapping node types is cleaner.
// I will create a High Order Component `withCommentBadge`.
