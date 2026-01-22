-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    flow_id UUID NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    node_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'RESOLVED', 'WONTFIX')),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create flow_visits table for unread tracking
CREATE TABLE IF NOT EXISTS flow_visits (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    flow_id UUID NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
    last_viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, flow_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_flow_node ON comments(flow_id, node_id);
CREATE INDEX IF NOT EXISTS idx_comments_flow_status ON comments(flow_id, status);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_visits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Comments
CREATE POLICY "Viewers can see comments" ON comments
    FOR SELECT USING (
        organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "Members can insert comments" ON comments
    FOR INSERT WITH CHECK (
        organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "Authors and Admins can update comments" ON comments
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );

-- RLS Policies for Visits
CREATE POLICY "Users can manage their own visits" ON flow_visits
    FOR ALL USING (auth.uid() = user_id);
