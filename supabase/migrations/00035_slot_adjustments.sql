-- Manual slot adjustments (positive or negative offsets to calculated values)
ALTER TABLE characters ADD COLUMN weapon_slots_adj integer NOT NULL DEFAULT 0;
ALTER TABLE characters ADD COLUMN nwp_slots_adj integer NOT NULL DEFAULT 0;
ALTER TABLE characters ADD COLUMN language_slots_adj integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN characters.weapon_slots_adj IS 'Manual adjustment to calculated weapon proficiency slots';
COMMENT ON COLUMN characters.nwp_slots_adj IS 'Manual adjustment to calculated NWP slots';
COMMENT ON COLUMN characters.language_slots_adj IS 'Manual adjustment to calculated language slots';
