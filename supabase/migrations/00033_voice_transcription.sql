-- Add transcription column for voice notes
ALTER TABLE session_entries ADD COLUMN audio_transcription text;

COMMENT ON COLUMN session_entries.audio_transcription IS 'Automatic transcription of voice notes via OpenAI Whisper';
