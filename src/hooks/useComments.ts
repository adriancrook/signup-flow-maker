import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';

type Comment = Database['public']['Tables']['comments']['Row'] & {
    replies?: Comment[];
    profiles?: { full_name: string | null; avatar_url: string | null; } | null;
    metadata?: any; // Helper for easier access
};

type CommentStatus = 'OPEN' | 'RESOLVED' | 'WONTFIX';

export function useComments(flowId: string) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Fetch initial comments
    const fetchComments = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('comments')
                .select('*, profiles!user_id(full_name, avatar_url)')
                .eq('flow_id', flowId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setComments((data as unknown as Comment[]) || []);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [flowId]);

    // Subscribe to Realtime changes
    useEffect(() => {
        if (!flowId) return;

        fetchComments();

        const channel = supabase
            .channel(`comments:${flowId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'comments',
                    filter: `flow_id=eq.${flowId}`,
                },
                (payload) => {
                    // Simple strategy: Re-fetch on any change for consistency
                    // Optimization: handle INSERT/UPDATE/DELETE optimistically
                    fetchComments();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [flowId, fetchComments]);



    // We need to fetch the Organization ID for the user to insert. 
    // This helper handles that.
    const createComment = async (content: string, nodeId: string, parentId?: string, metadata?: any) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // Get profile to find Org ID
        const { data: profile } = await supabase
            .from('profiles')
            .select('organization_id')
            .eq('id', user.id)
            .single();

        if (!profile) throw new Error("Profile not found");

        const { data: newComment, error } = await supabase.from('comments').insert({
            flow_id: flowId,
            user_id: user.id,
            organization_id: profile.organization_id,
            content,
            node_id: nodeId,
            parent_id: parentId,
            status: 'OPEN',
            metadata: metadata || null
        }).select('*, profiles!user_id(full_name, avatar_url)').single();

        if (error) throw error;

        // Optimistic update: append the new comment immediately
        if (newComment) {
            setComments(prev => [...prev, newComment as unknown as Comment]);
        }
    }

    const updateStatus = async (commentId: string, status: CommentStatus) => {
        // Optimistic update
        setComments(prev => prev.map(c => c.id === commentId ? { ...c, status } : c));

        const { error } = await supabase
            .from('comments')
            .update({ status })
            .eq('id', commentId);

        if (error) {
            // Revert on error
            fetchComments();
            throw error;
        }
    };

    const deleteComment = async (commentId: string) => {
        // Optimistic update
        setComments(prev => prev.filter(c => c.id !== commentId));

        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);

        if (error) {
            // Revert on error
            fetchComments();
            throw error;
        }
    };

    const editComment = async (commentId: string, content: string) => {
        // Optimistic update
        setComments(prev => prev.map(c => c.id === commentId ? { ...c, content } : c));

        const { error } = await supabase
            .from('comments')
            .update({ content })
            .eq('id', commentId);

        if (error) {
            // Revert on error
            fetchComments();
            throw error;
        }
    };

    const updateCommentMetadata = async (commentId: string, updates: any) => {
        const comment = comments.find(c => c.id === commentId);
        if (!comment) return;

        const newMetadata = { ...(comment.metadata as object), ...updates };

        // Optimistic update
        setComments(prev => prev.map(c => c.id === commentId ? { ...c, metadata: newMetadata } : c));

        const { error } = await supabase
            .from('comments')
            .update({ metadata: newMetadata })
            .eq('id', commentId);

        if (error) {
            fetchComments();
            throw error;
        }
    };

    return {
        comments,
        isLoading,
        error,
        createComment,
        updateStatus,
        deleteComment,
        editComment,
        updateCommentMetadata,
        refresh: fetchComments
    };
}
