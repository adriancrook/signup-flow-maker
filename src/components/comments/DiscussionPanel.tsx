import { useState, useMemo, useRef, useEffect } from 'react';
import { useCommentsContext } from './CommentsContext';
import { CommentThread } from './CommentThread';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, MessageSquarePlus, Filter } from "lucide-react";

interface DiscussionPanelProps {
    flowId: string;
    nodeId: string | null;
    onClose: () => void;
    currentUserId: string; // needed for actions
    initialPosition?: { x: number, y: number };
}

export function DiscussionPanel({ flowId, nodeId, onClose, currentUserId, initialPosition }: DiscussionPanelProps) {
    const { comments, createComment, updateStatus, deleteComment, editComment, isLoading } = useCommentsContext();
    const [newComment, setNewComment] = useState("");

    // Draggable State
    const [position, setPosition] = useState(initialPosition || { x: window.innerWidth - 350, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (initialPosition) {
            setPosition(initialPosition);
        }
    }, [initialPosition]);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only allow dragging from the header/handle
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.tagName === 'BUTTON') return;

        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            e.preventDefault(); // Prevent text selection
            setPosition({
                x: e.clientX - dragOffset.current.x,
                y: e.clientY - dragOffset.current.y
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // Filter comments for this node
    const nodeComments = useMemo(() => {
        if (!nodeId) return [];

        const roots = comments.filter(c => c.node_id === nodeId && !c.parent_id);
        const savedReplies = comments.filter(c => c.node_id === nodeId && c.parent_id);

        return roots.map(root => ({
            ...root,
            replies: savedReplies.filter(r => r.parent_id === root.id).sort((a, b) => (a.created_at || "") > (b.created_at || "") ? 1 : -1)
        }));
    }, [comments, nodeId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !nodeId) return;
        try {
            await createComment(newComment, nodeId);
            setNewComment("");
        } catch (error) {
            console.error("Failed to post comment:", error);
            // Ideally show a toast here
        }
    };

    if (!nodeId) return null;

    return (
        <div
            className="fixed w-80 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col max-h-[80vh] z-50 animate-in fade-in duration-200"
            style={{
                left: position.x,
                top: position.y,
            }}
        >
            {/* Header */}
            <div
                className="p-3 border-b flex items-center justify-between bg-gray-50 rounded-t-lg handle cursor-move select-none"
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center gap-2 pointer-events-none">
                    <MessageSquarePlus className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-sm">Comments</span>
                    <span className="text-xs text-gray-500 bg-gray-200 px-1.5 rounded-full">{nodeComments.length}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                        <X className="w-3 h-3" />
                    </Button>
                </div>
            </div>

            {/* List */}
            <ScrollArea className="flex-1 p-0">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
                ) : nodeComments.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">
                        No comments yet.<br />Be the first to say something!
                    </div>
                ) : (
                    nodeComments.map(comment => (
                        <CommentThread
                            key={comment.id}
                            comment={comment}
                            currentUserId={currentUserId}
                            onReply={createComment}
                            onResolve={(id, status) => updateStatus(id, status)}
                            onDelete={deleteComment}
                            onEdit={editComment}
                        />
                    ))
                )}
            </ScrollArea>

            {/* Composer */}
            <div className="p-3 border-t bg-gray-50 rounded-b-lg">
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                        />
                        <Button type="submit" size="sm" disabled={!newComment.trim()}>Post</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
