-- Bracers of Defense, Rings of Protection etc. set AC but don't count as "real" armor
-- for the unarmored defense bonus (Player's Option: Skills & Powers)
ALTER TABLE public.armor
  ADD COLUMN IF NOT EXISTS is_magical_protection boolean NOT NULL DEFAULT false;
