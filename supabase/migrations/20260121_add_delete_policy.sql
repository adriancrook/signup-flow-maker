-- Policy: Authors and Admins can delete comments
CREATE POLICY "Authors and Admins can delete comments" ON comments
    FOR DELETE USING (
        auth.uid() = user_id OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
    );
