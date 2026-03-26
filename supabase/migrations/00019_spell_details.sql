-- ═══════════════════════════════════════════════════════════════════════════════
-- PR 5: Zauber-Details — Casting Time + Saving Throw
-- ═══════════════════════════════════════════════════════════════════════════════

alter table public.spells
  add column if not exists casting_time text not null default '',
  add column if not exists saving_throw text not null default 'None';
