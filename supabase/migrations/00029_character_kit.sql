-- Add kit field to characters for class kits (e.g., Barbarian, Cavalier).
-- Kits modify hit dice, allowed armor, class abilities, etc.
ALTER TABLE characters ADD COLUMN kit text;
