-- Create a view to calculate unread comment counts for each flow and user
-- Logic: 
-- 1. Join flows to flow_visits to get the user's last view time.
-- 2. Join comments that are OPEN and created AFTER the last view time (or all comments if never viewed).
-- 3. Group by flow to get the count.

CREATE OR REPLACE VIEW flow_unread_counts AS
SELECT
    f.id as flow_id,
    auth.uid() as user_id,
    COUNT(c.id) as unread_count
FROM flows f
JOIN flow_visits fv ON f.id = fv.flow_id AND fv.user_id = auth.uid()
LEFT JOIN comments c ON f.id = c.flow_id 
    AND (c.created_at > fv.last_viewed_at)
    AND c.status = 'OPEN'
GROUP BY f.id, auth.uid();

-- Grant access
GRANT SELECT ON flow_unread_counts TO authenticated;
