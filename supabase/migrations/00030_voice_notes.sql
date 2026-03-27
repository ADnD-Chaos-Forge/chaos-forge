-- Add audio_url to session entries for voice note support.
-- Audio files are stored in Supabase Storage bucket 'voice-notes'.
ALTER TABLE session_entries ADD COLUMN audio_url text;

-- Create storage bucket for voice notes (if not exists).
-- Note: Supabase Storage bucket creation is done via the dashboard or API,
-- not via SQL migrations. This migration only adds the column.
