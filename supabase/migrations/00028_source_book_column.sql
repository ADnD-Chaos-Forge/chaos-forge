-- Add source_book column to all content tables.
-- Tracks which PHB/supplement book an item, weapon, armor, or spell originates from.
-- Default: 'Players Handbook' for all existing entries.

ALTER TABLE weapons ADD COLUMN source_book text NOT NULL DEFAULT 'Players Handbook';
ALTER TABLE armor ADD COLUMN source_book text NOT NULL DEFAULT 'Players Handbook';
ALTER TABLE spells ADD COLUMN source_book text NOT NULL DEFAULT 'Players Handbook';
ALTER TABLE general_items ADD COLUMN source_book text NOT NULL DEFAULT 'Players Handbook';
