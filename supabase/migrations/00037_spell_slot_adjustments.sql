-- Manual spell slot adjustments per level (JSON object: {"1": 1, "3": -1} etc.)
ALTER TABLE characters ADD COLUMN spell_slots_adj jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN characters.spell_slots_adj IS 'Manual spell slot adjustments per spell level, e.g. {"1": 2, "4": -1}';
