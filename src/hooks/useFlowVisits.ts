import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useFlowVisits(flowId: string) {
    const [lastViewedAt, setLastViewedAt] = useState<string | null>(null);

    // Fetch visit info
    const fetchVisit = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('flow_visits')
            .select('last_viewed_at')
            .eq('flow_id', flowId)
            .eq('user_id', user.id)
            .maybeSingle();

        if (data) {
            setLastViewedAt(data.last_viewed_at);
        } else {
            // Never visited? Treat as "now" or "beginning of time"?
            // Spec says "New Comments" badge logic depends on this. 
            // If never visited, everything is effectively "unread" or "read" depending on UX.
            // Usually, first visit = mark as read immediately.
        }
    }, [flowId]);

    const markAsRead = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const now = new Date().toISOString();

        // Upsert visit
        const { error } = await supabase
            .from('flow_visits')
            .upsert({
                flow_id: flowId,
                user_id: user.id,
                last_viewed_at: now
            }, { onConflict: 'user_id, flow_id' });

        if (!error) {
            setLastViewedAt(now);
        }
    };

    // On mount, fetch.
    useEffect(() => {
        if (flowId) fetchVisit();
    }, [flowId, fetchVisit]);

    return {
        lastViewedAt,
        markAsRead
    };
}
