-- ═══════════════════════════════════════════════════════════════════════════════
-- Epic 5: Allow all authenticated users to read all characters
-- (needed for Dashboard + OCR import workflow)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Drop the old select policy (users can only view their own)
drop policy if exists "Users can view their own characters" on public.characters;

-- New select policy: all authenticated users can read all characters
create policy "Authenticated users can view all characters"
  on public.characters for select
  using (auth.role() = 'authenticated');

-- Insert/Update/Delete policies remain unchanged (own characters only)
