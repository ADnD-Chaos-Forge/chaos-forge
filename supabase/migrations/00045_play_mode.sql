-- Play Mode: Track spell resource expenditure during sessions
ALTER TABLE public.characters
  ADD COLUMN IF NOT EXISTS spell_points_used integer NOT NULL DEFAULT 0;

ALTER TABLE public.character_spells
  ADD COLUMN IF NOT EXISTS expended boolean NOT NULL DEFAULT false;
