-- ═══════════════════════════════════════════════════════════════════════════════
-- PR 3: Diebesfähigkeiten — 7 Prozent-basierte Fähigkeiten
-- ═══════════════════════════════════════════════════════════════════════════════

alter table public.characters
  add column thief_pick_locks integer not null default 0,
  add column thief_find_traps integer not null default 0,
  add column thief_move_silently integer not null default 0,
  add column thief_hide_shadows integer not null default 0,
  add column thief_climb_walls integer not null default 0,
  add column thief_detect_noise integer not null default 0,
  add column thief_read_languages integer not null default 0;
