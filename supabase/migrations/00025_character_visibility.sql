-- Character Visibility / Sharing
-- Adds is_public flag and character_shares table for fine-grained access control.

-- 1. Add is_public column to characters
ALTER TABLE characters ADD COLUMN is_public BOOLEAN DEFAULT false;

-- 2. Create character_shares table
CREATE TABLE character_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  shared_with_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(character_id, shared_with_user_id)
);

-- 3. Enable RLS on character_shares
ALTER TABLE character_shares ENABLE ROW LEVEL SECURITY;

-- 4. Character owner can manage shares (INSERT, UPDATE, DELETE, SELECT)
CREATE POLICY "Owner can manage shares" ON character_shares
  FOR ALL USING (
    EXISTS (SELECT 1 FROM characters WHERE id = character_shares.character_id AND user_id = auth.uid())
  );

-- 5. Users can see shares directed at them
CREATE POLICY "Users can see own shares" ON character_shares
  FOR SELECT USING (shared_with_user_id = auth.uid());

-- 6. Replace the old permissive SELECT policy on characters
DROP POLICY IF EXISTS "Authenticated users can view all characters" ON characters;

CREATE POLICY "Users can view own, shared, or public characters" ON characters
  FOR SELECT USING (
    auth.uid() = user_id
    OR is_public = true
    OR EXISTS (SELECT 1 FROM character_shares WHERE character_id = characters.id AND shared_with_user_id = auth.uid())
  );
