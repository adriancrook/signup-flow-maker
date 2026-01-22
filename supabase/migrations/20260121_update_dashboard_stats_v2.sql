-- Update view to include Sticky Notes in comment counts
-- Fixed to join flow_versions since flow state is stored there
CREATE OR REPLACE VIEW flow_dashboard_stats AS
SELECT
    f.id as flow_id,
    auth.uid() as observer_id,
    
    -- Combined Total: Database Open Comments + Sticky Notes
    (
        COUNT(c.id) FILTER (WHERE c.status = 'OPEN') 
        + 
        COALESCE(sn_stats.total_stickies, 0)
    ) as total_open_comments,

    -- Combined Unread: Database Unread + Sticky Note Unread
    (
        COUNT(c.id) FILTER (
            WHERE c.status = 'OPEN' 
            AND c.user_id != auth.uid() 
            AND (
                fv.last_viewed_at IS NULL 
                OR c.created_at > fv.last_viewed_at
            )
        )
        +
        COALESCE(sn_stats.unread_stickies, 0)
    ) as unread_count

FROM flows f
-- Left join visits to get last view time for the current user
LEFT JOIN flow_visits fv ON f.id = fv.flow_id AND fv.user_id = auth.uid()
-- Left join comments to aggregate stats
LEFT JOIN comments c ON f.id = c.flow_id
-- Left join current version to get flow nodes
LEFT JOIN flow_versions ver ON f.current_version_id = ver.id

-- Lateral join to calculate sticky stats for this flow + user context
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) as total_stickies,
        COUNT(*) FILTER (
            WHERE 
                -- Check for Unread:
                -- 1. Not own note (check authorId against current user)
                (node->'data'->'metadata'->>'authorId') IS DISTINCT FROM auth.uid()::text
                AND 
                -- 2. Newer than last visit (or never visited)
                (
                    fv.last_viewed_at IS NULL 
                    OR 
                    (node->'data'->'metadata'->>'createdAt')::timestamptz > fv.last_viewed_at
                )
        ) as unread_stickies
    FROM jsonb_array_elements(ver.data->'nodes') as node
    WHERE node->>'type' = 'STICKY-NOTE'
) sn_stats ON TRUE

GROUP BY f.id, auth.uid(), fv.last_viewed_at, sn_stats.total_stickies, sn_stats.unread_stickies;

GRANT SELECT ON flow_dashboard_stats TO authenticated;
