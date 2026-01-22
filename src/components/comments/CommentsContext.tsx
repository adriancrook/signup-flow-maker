import { createContext, useContext } from 'react';
import type { Database } from '@/types/supabase';

type Comment = Database['public']['Tables']['comments']['Row'];

interface CommentsContextType {
    comments: Comment[];
    lastViewedAt: string | null;
    currentUserId: string | null;
    isLoading: boolean;
    createComment: (content: string, nodeId: string, parentId?: string) => Promise<void>;
    updateStatus: (commentId: string, status: 'OPEN' | 'RESOLVED' | 'WONTFIX') => Promise<void>;
    deleteComment: (commentId: string) => Promise<void>;
    editComment: (commentId: string, content: string) => Promise<void>;
}

const CommentsContext = createContext<CommentsContextType>({
    comments: [],
    lastViewedAt: null,
    currentUserId: null,
    isLoading: false,
    createComment: async () => { },
    updateStatus: async () => { },
    deleteComment: async () => { },
    editComment: async () => { }
});

export const useCommentsContext = () => useContext(CommentsContext);
export const CommentsProvider = CommentsContext.Provider;
