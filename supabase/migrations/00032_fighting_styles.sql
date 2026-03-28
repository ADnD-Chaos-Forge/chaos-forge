-- Fighting Styles from the Complete Fighter's Handbook (PHBR01).
-- Styles are separate from weapon proficiencies and cost WP slots.

CREATE TABLE character_fighting_styles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid REFERENCES characters(id) ON DELETE CASCADE NOT NULL,
  style_id text NOT NULL,
  slots_invested integer NOT NULL DEFAULT 1,
  UNIQUE(character_id, style_id)
);

ALTER TABLE character_fighting_styles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage fighting styles" ON character_fighting_styles
  FOR ALL USING (public.is_character_owner(character_id))
  WITH CHECK (public.is_character_owner(character_id));

CREATE POLICY "Authenticated can read fighting styles" ON character_fighting_styles
  FOR SELECT USING (auth.role() = 'authenticated');
