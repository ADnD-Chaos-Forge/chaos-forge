-- ═══════════════════════════════════════════════════════════════════════════════
-- Sub-Epic A: Additional character fields (alignment, XP, gold)
-- ═══════════════════════════════════════════════════════════════════════════════

alter table public.characters
  add column alignment text not null default 'true_neutral',
  add column xp_current integer not null default 0,
  add column gold_pp integer not null default 0,
  add column gold_gp integer not null default 0,
  add column gold_ep integer not null default 0,
  add column gold_sp integer not null default 0,
  add column gold_cp integer not null default 0;
