-- ═══════════════════════════════════════════════════════════════════════════════
-- Epic 5: Delete policies for session entries and sessions
-- ═══════════════════════════════════════════════════════════════════════════════

-- Users can delete their own session entries
create policy "Users can delete their own session entries"
  on public.session_entries for delete
  using (auth.uid() = user_id);

-- Session creators can delete their sessions
create policy "Session creators can delete their sessions"
  on public.sessions for delete
  using (auth.uid() = created_by);
