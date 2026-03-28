-- Allow authenticated users to insert custom weapons and armor
CREATE POLICY "Authenticated can insert custom weapons" ON weapons
  FOR INSERT TO authenticated
  WITH CHECK (is_custom = true AND created_by = auth.uid());

CREATE POLICY "Authenticated can insert custom armor" ON armor
  FOR INSERT TO authenticated
  WITH CHECK (is_custom = true AND created_by = auth.uid());
