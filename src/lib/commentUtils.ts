
import type { Database } from '@/types/supabase';
import type { FlowNode } from '@/store/editorStore';

type Comment = Database['public']['Tables']['comments']['Row'] & {
    replies?: Comment[];
    profiles?: { full_name: string | null; avatar_url: string | null; } | null;
    metadata?: Record<string, unknown>;
};

export function generateCommentExport(flowId: string, flowName: string, comments: Comment[], nodes: FlowNode[]): string {
    const lines: string[] = [];

    // Header
    lines.push(`# Comments Export: ${flowName}`);
    lines.push(`Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);
    lines.push(`Flow ID: ${flowId}`);
    lines.push('---');
    lines.push('');

    // Group comments by node_id
    const grouped: Record<string, Comment[]> = {};
    const stickyNotes: Comment[] = [];

    comments.forEach(c => {
        // Filter out resolved if desired? No, spec says "all comments".
        // But maybe sort them?

        // Sticky Notes (no node_id or node_id='global' or type='sticky' in metadata)
        if (c.metadata?.type === 'sticky') {
            stickyNotes.push(c);
            return;
        }

        const nodeId = c.node_id;
        if (!nodeId) {
            // Should be covered by sticky check, but just in case
            stickyNotes.push(c);
            return;
        }

        if (!grouped[nodeId]) {
            grouped[nodeId] = [];
        }
        grouped[nodeId].push(c);
    });

    // Helper to format a single comment
    const formatComment = (c: Comment) => {
        const author = c.profiles?.full_name || 'Unknown User';
        const date = new Date(c.created_at || '').toLocaleString();
        const status = c.status !== 'OPEN' ? ` [${c.status}]` : '';

        let text = `- **${author}** (${date})${status}: ${c.content}`;

        if (c.replies && c.replies.length > 0) {
            c.replies.forEach(reply => {
                const rAuthor = reply.profiles?.full_name || 'Unknown User';
                // Removed unused rDate variable
                text += `\n  - **${rAuthor}**: ${reply.content}`;
            });
        }
        return text;
    };

    // 1. Process Nodes based on Graph Order? Or just Alphabetical?
    // Alphabetical by Screen Title seems best for a report.
    const sortedNodeIds = Object.keys(grouped).sort((a, b) => {
        const nodeA = nodes.find(n => n.id === a);
        const nodeB = nodes.find(n => n.id === b);
        const titleA = nodeA?.data?.screen?.title || 'Unknown Screen';
        const titleB = nodeB?.data?.screen?.title || 'Unknown Screen';
        return titleA.localeCompare(titleB);
    });

    sortedNodeIds.forEach(nodeId => {
        const node = nodes.find(n => n.id === nodeId);
        const screenName = node?.data?.screen?.title || `Screen ${nodeId}`;
        const nodeComments = grouped[nodeId];

        // Deep Link
        // Assuming the editor URL is the standard one. 
        // We can't know the full domain here easily, so relative or absolute if known.
        // Let's use `window.location.origin` if we were client side, but this might run server side?
        // Actually this will run in `EditorToolbar` (Client Component).
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const link = `${origin}/editor/${flowId}?nodeId=${nodeId}`;

        lines.push(`## ${screenName}`);
        if (node?.data?.screen?.componentCode) {
            lines.push(`**Codename**: \`${node.data.screen.componentCode}\``);
        }
        lines.push(`[Go to Screen](${link})`);
        lines.push('');

        nodeComments.forEach(c => lines.push(formatComment(c)));
        lines.push('');
    });

    // 2. Sticky Notes
    if (stickyNotes.length > 0) {
        lines.push('## Sticky Notes / General Comments');
        lines.push('');
        stickyNotes.forEach(c => lines.push(formatComment(c)));
    }

    return lines.join('\n');
}
