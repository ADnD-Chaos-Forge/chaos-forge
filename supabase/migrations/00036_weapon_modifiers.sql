-- Weapon magic/modifier bonuses per equipped weapon
ALTER TABLE character_equipment ADD COLUMN hit_bonus integer NOT NULL DEFAULT 0;
ALTER TABLE character_equipment ADD COLUMN damage_bonus integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN character_equipment.hit_bonus IS 'Magic or modifier bonus to attack rolls (e.g. +2 weapon)';
COMMENT ON COLUMN character_equipment.damage_bonus IS 'Magic or modifier bonus to damage rolls';
