import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, Reply, Trash2, Pencil, X, Save } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/supabase";

type Comment = Database['public']['Tables']['comments']['Row'] & {
    replies?: Comment[];
    profiles?: { full_name: string | null; avatar_url: string | null; } | null;
};

interface CommentThreadProps {
    comment: Comment;
    onReply: (content: string, parentId: string) => void;
    onResolve: (commentId: string, status: 'OPEN' | 'RESOLVED') => void;
    onDelete?: (commentId: string) => void;
    onEdit?: (commentId: string, content: string) => void;
    currentUserId: string;
}

export function CommentThread({ comment, onReply, onResolve, onDelete, onEdit, currentUserId }: CommentThreadProps) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    const isOwner = comment.user_id === currentUserId;
    const authorName = comment.profiles?.full_name || `User ${comment.user_id.slice(0, 4)}`;
    const avatarUrl = comment.profiles?.avatar_url;
    const fallbackInitials = authorName.slice(0, 2).toUpperCase();

    const handleSubmitReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        onReply(replyContent, comment.id);
        setReplyContent("");
        setIsReplying(false);
    };

    const handleSaveEdit = () => {
        if (!editContent.trim() || !onEdit) return;
        onEdit(comment.id, editContent);
        setIsEditing(false);
    };

    return (
        <div className={cn("p-4 border-b last:border-0", comment.status === 'RESOLVED' && "opacity-50 bg-gray-50")}>
            <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                    {avatarUrl && <AvatarImage src={avatarUrl} />}
                    <AvatarFallback>{fallbackInitials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">{authorName}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                                {comment.created_at && formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </span>
                            {comment.status === 'RESOLVED' && (
                                <span className="flex items-center text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-100">
                                    <Check className="w-3 h-3 mr-1" />
                                    Resolved
                                </span>
                            )}
                            {isOwner && !isEditing && comment.status !== 'RESOLVED' && (
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 hover:text-blue-600" onClick={() => setIsEditing(true)}>
                                        <Pencil className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 hover:text-red-600" onClick={() => onDelete?.(comment.id)}>
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="space-y-2">
                            <textarea
                                className="w-full text-sm border rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={2}
                            />
                            <div className="flex gap-2 justify-end">
                                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button size="sm" className="h-7 text-xs" onClick={handleSaveEdit}>Save</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-700 prose prose-sm max-w-none break-words">
                            {comment.content}
                        </div>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                        {comment.status !== 'RESOLVED' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-gray-500"
                                onClick={() => setIsReplying(!isReplying)}
                            >
                                <Reply className="w-3 h-3 mr-1" /> Reply
                            </Button>
                        )}
                        {comment.status !== 'RESOLVED' ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => onResolve(comment.id, 'RESOLVED')}
                            >
                                <Check className="w-3 h-3 mr-1" /> Resolve
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                                onClick={() => onResolve(comment.id, 'OPEN')}
                            >
                                <Reply className="w-3 h-3 mr-1" /> Re-open
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-11 mt-3 space-y-3 border-l-2 pl-3">
                    {comment.replies.map(reply => (
                        <div key={reply.id} className="text-sm">
                            <CommentThread
                                comment={reply}
                                currentUserId={currentUserId}
                                onReply={onReply}
                                onResolve={onResolve}
                                onDelete={onDelete}
                                onEdit={onEdit}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Reply Input */}
            {isReplying && (
                <form onSubmit={handleSubmitReply} className="mt-3 ml-11">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="flex-1 text-sm border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Write a reply..."
                            autoFocus
                        />
                        <Button type="submit" size="sm" className="h-7">Send</Button>
                    </div>
                </form>
            )}
        </div>
    );
}
