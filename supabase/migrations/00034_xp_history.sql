-- XP history for tracking XP gains per session
CREATE TABLE xp_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  session_id uuid REFERENCES sessions(id) ON DELETE SET NULL,
  xp_amount integer NOT NULL,
  note text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE xp_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage XP history" ON xp_history
  FOR ALL USING (public.is_character_owner(character_id))
  WITH CHECK (public.is_character_owner(character_id));

CREATE POLICY "Authenticated can view XP history" ON xp_history
  FOR SELECT USING (auth.role() = 'authenticated');

COMMENT ON TABLE xp_history IS 'Tracks XP gains per character, optionally linked to a session';
