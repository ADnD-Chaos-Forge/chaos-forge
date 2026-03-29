-- Chronicle Quotes: Global quotes section with emoji reactions
-- Quotes: all can read, only creator can edit/delete
-- Reactions: all can read/add, only own reactions can be removed

CREATE TABLE chronicle_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  attributed_to text DEFAULT '',
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE chronicle_quote_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES chronicle_quotes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(quote_id, user_id, emoji)
);

ALTER TABLE chronicle_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chronicle_quote_reactions ENABLE ROW LEVEL SECURITY;

-- Quotes policies
CREATE POLICY "Authenticated can read quotes"
  ON chronicle_quotes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert quotes"
  ON chronicle_quotes FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creator can update quotes"
  ON chronicle_quotes FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Creator can delete quotes"
  ON chronicle_quotes FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Reactions policies
CREATE POLICY "Authenticated can read reactions"
  ON chronicle_quote_reactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert reactions"
  ON chronicle_quote_reactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions"
  ON chronicle_quote_reactions FOR DELETE TO authenticated USING (auth.uid() = user_id);
