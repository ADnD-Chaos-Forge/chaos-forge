-- ═══════════════════════════════════════════════════════════════════════════════
-- PR 1: Personal details + Ability Sub-Scores (Player's Option)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Personal details
alter table public.characters
  add column player_name text not null default '',
  add column age integer,
  add column height_cm integer,
  add column weight_kg integer,
  add column gender text not null default '',
  add column hair_color text not null default '',
  add column eye_color text not null default '';

-- Ability Sub-Scores (Player's Option: Skills & Powers)
-- Each base ability (3-18) splits into two sub-scores
alter table public.characters
  add column str_stamina integer,
  add column str_muscle integer,
  add column dex_aim integer,
  add column dex_balance integer,
  add column con_health integer,
  add column con_fitness integer,
  add column int_reason integer,
  add column int_knowledge integer,
  add column wis_intuition integer,
  add column wis_willpower integer,
  add column cha_leadership integer,
  add column cha_appearance integer;
