-- Spell system toggle: slots (traditional) or points (Player's Option)
ALTER TABLE characters ADD COLUMN spell_system text NOT NULL DEFAULT 'slots'
  CHECK (spell_system IN ('slots', 'points'));
