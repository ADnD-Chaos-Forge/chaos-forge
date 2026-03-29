-- Chronicle NPCs: Global NPC documentation for the chronicle
-- All authenticated users can perform full CRUD

CREATE TABLE chronicle_npcs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text DEFAULT '',
  description text DEFAULT '',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE chronicle_npcs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users full access on npcs"
  ON chronicle_npcs FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE TRIGGER chronicle_npcs_updated_at
  BEFORE UPDATE ON chronicle_npcs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
