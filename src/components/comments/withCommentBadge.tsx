import React, { useMemo } from 'react';
import { NodeProps } from '@xyflow/react';
import { useCommentsContext } from './CommentsContext';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useEditorStore } from '@/store/editorStore';

export function withCommentBadge<T extends NodeProps>(WrappedComponent: React.ComponentType<T>) {
    return function CommentBadgeWrapper(props: T) {
        const { comments, lastViewedAt, currentUserId } = useCommentsContext();
        const { openDiscussion } = useEditorStore();
        const nodeId = props.id;

        const badgeInfo = useMemo(() => {
            const nodeComments = comments.filter(c => c.node_id === nodeId && c.status !== 'RESOLVED');
            // If no comments, return a special "empty" state object logic check
            if (nodeComments.length === 0) return { count: 0, hasUnread: false };

            const count = nodeComments.length;
            const hasUnread = nodeComments.some(c =>
                c.user_id !== currentUserId &&
                (!lastViewedAt || (c.created_at && new Date(c.created_at) > new Date(lastViewedAt)))
            );

            return { count, hasUnread };
        }, [comments, lastViewedAt, nodeId, currentUserId]);

        const handleBadgeClick = (e: React.MouseEvent) => {
            e.stopPropagation(); // Prevent node selection if preferred, or allow it. Usually separate action.
            openDiscussion(nodeId);
        };

        return (
            <div className="relative group">
                <WrappedComponent {...props} />

                {/* Active Badge (Floating OUTSIDE) - Only shows if count > 0 */}
                {badgeInfo.count > 0 && (
                    <div
                        onClick={handleBadgeClick}
                        className={cn(
                            "absolute -top-3 -right-3 flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full text-xs font-bold shadow-md border-2 border-white transition-all transform scale-100 cursor-pointer hover:scale-110 z-50",
                            badgeInfo.hasUnread
                                ? "bg-red-500 text-white animate-in zoom-in"
                                : "bg-gray-200 text-gray-500"
                        )}
                    >
                        {badgeInfo.hasUnread && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>}
                        <MessageSquare className="w-3 h-3 mr-1" fill={badgeInfo.hasUnread ? "currentColor" : "none"} />
                        {badgeInfo.count}
                    </div>
                )}

                {/* Empty State Trigger (Inside Top-Right) - Only shows if count === 0 */}
                {badgeInfo.count === 0 && (
                    <div
                        onClick={handleBadgeClick}
                        className="absolute top-2 right-2 p-1.5 rounded-md text-gray-300 hover:text-gray-500 hover:bg-black/5 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                        title="Add comment"
                    >
                        <MessageSquare className="w-4 h-4" />
                    </div>
                )}
            </div>
        );
    };
}
