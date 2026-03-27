-- Add is_active flag to characters for archiving inactive characters.
-- Active characters appear first, inactive ones are collapsed below.
ALTER TABLE characters ADD COLUMN is_active boolean NOT NULL DEFAULT true;
