-- ═══════════════════════════════════════════════════════════════════════════════
-- Per-character toggle: ignore encumbrance for AC calculation
-- When true, the character always counts as "unencumbered" for the
-- Player's Option unarmored defense bonus (-2 AC for warriors/rogues).
-- ═══════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.characters
  ADD COLUMN IF NOT EXISTS ignore_encumbrance boolean NOT NULL DEFAULT true;
