-- ═══════════════════════════════════════════════════════════════════════════════
-- Epic 2: AD&D Core Rules Schema
-- Races, Classes, Weapons, Armor, Spells
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── RACES ─────────────────────────────────────────────────────────────────────

create table public.races (
  id text primary key,
  name text not null,
  ability_adjustments jsonb not null default '{}',
  infravision integer not null default 0,
  ability_minimums jsonb not null default '{}',
  ability_maximums jsonb not null default '{}'
);

-- ─── CLASSES ───────────────────────────────────────────────────────────────────

create table public.classes (
  id text primary key,
  name text not null,
  class_group text not null check (class_group in ('warrior', 'priest', 'rogue', 'wizard')),
  hit_die integer not null,
  ability_requirements jsonb not null default '{}',
  prime_requisites text[] not null default '{}',
  exceptional_strength boolean not null default false
);

-- ─── RACE/CLASS RESTRICTIONS ───────────────────────────────────────────────────

create table public.race_class_restrictions (
  race_id text references public.races(id) on delete cascade,
  class_id text references public.classes(id) on delete cascade,
  level_limit integer, -- null = unlimited
  primary key (race_id, class_id)
);

-- ─── WEAPONS ───────────────────────────────────────────────────────────────────

create table public.weapons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  damage_sm text not null, -- e.g. '1d8' (vs Small/Medium)
  damage_l text not null,  -- e.g. '1d12' (vs Large)
  weapon_type text not null check (weapon_type in ('melee', 'ranged', 'both')),
  speed integer not null,
  weight numeric(5,1) not null, -- in lbs
  cost_gp numeric(8,1) not null,
  range_short integer, -- in feet, null for melee
  range_medium integer,
  range_long integer
);

-- ─── ARMOR ─────────────────────────────────────────────────────────────────────

create table public.armor (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  ac integer not null, -- base armor class
  weight numeric(5,1) not null, -- in lbs
  cost_gp numeric(8,1) not null,
  max_movement integer not null -- base movement rate
);

-- ─── SPELLS ────────────────────────────────────────────────────────────────────

create table public.spells (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  level integer not null,
  spell_type text not null check (spell_type in ('wizard', 'priest')),
  school text, -- magic school for wizard spells
  sphere text, -- priest sphere for priest spells
  range text not null,
  duration text not null,
  area_of_effect text not null,
  components text[] not null default '{}', -- {'V', 'S', 'M'}
  description text not null default ''
);

-- ─── RLS ───────────────────────────────────────────────────────────────────────
-- Reference tables are readable by all authenticated users

alter table public.races enable row level security;
alter table public.classes enable row level security;
alter table public.race_class_restrictions enable row level security;
alter table public.weapons enable row level security;
alter table public.armor enable row level security;
alter table public.spells enable row level security;

create policy "Reference data is readable by authenticated users" on public.races
  for select using (auth.role() = 'authenticated');
create policy "Reference data is readable by authenticated users" on public.classes
  for select using (auth.role() = 'authenticated');
create policy "Reference data is readable by authenticated users" on public.race_class_restrictions
  for select using (auth.role() = 'authenticated');
create policy "Reference data is readable by authenticated users" on public.weapons
  for select using (auth.role() = 'authenticated');
create policy "Reference data is readable by authenticated users" on public.armor
  for select using (auth.role() = 'authenticated');
create policy "Reference data is readable by authenticated users" on public.spells
  for select using (auth.role() = 'authenticated');
