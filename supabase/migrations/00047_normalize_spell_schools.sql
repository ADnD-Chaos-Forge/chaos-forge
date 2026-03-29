-- Normalize spell school values to lowercase (consistent with PHB seed data and UI filters)
-- Migration 00043 inserted Compendium spells with capitalized school names ('Illusion', 'Alteration', etc.)
-- but UI filters expect lowercase ('illusion', 'alteration', etc.)

UPDATE public.spells SET school = LOWER(school) WHERE school IS NOT NULL AND school != LOWER(school);
UPDATE public.spells SET sphere = LOWER(sphere) WHERE sphere IS NOT NULL AND sphere != LOWER(sphere);
