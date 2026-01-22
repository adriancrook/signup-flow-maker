-- View to calculate both total open comments and unread comments for the dashboard
CREATE OR REPLACE VIEW flow_dashboard_stats AS
SELECT
    f.id as flow_id,
    auth.uid() as observer_id,
    -- Total open comments on the flow
    COUNT(c.id) FILTER (WHERE c.status = 'OPEN') as total_open_comments,
    -- Unread comments for this user (Open, Not theirs, Newer than last visit)
    COUNT(c.id) FILTER (
        WHERE c.status = 'OPEN' 
        AND c.user_id != auth.uid() 
        AND (
            fv.last_viewed_at IS NULL 
            OR c.created_at > fv.last_viewed_at
        )
    ) as unread_count
FROM flows f
-- Left join visits to get last view time for the current user
LEFT JOIN flow_visits fv ON f.id = fv.flow_id AND fv.user_id = auth.uid()
-- Left join comments to aggregate stats
LEFT JOIN comments c ON f.id = c.flow_id
GROUP BY f.id, auth.uid();

GRANT SELECT ON flow_dashboard_stats TO authenticated;
