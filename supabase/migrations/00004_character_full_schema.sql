-- ═══════════════════════════════════════════════════════════════════════════════
-- Epic 3a: Full character schema
-- ═══════════════════════════════════════════════════════════════════════════════

-- Extend characters table with full AD&D attributes
alter table public.characters
  add column level integer not null default 1,
  add column race_id text references public.races(id),
  add column class_id text references public.classes(id),
  add column str integer not null default 10,
  add column str_exceptional integer,
  add column dex integer not null default 10,
  add column con integer not null default 10,
  add column int integer not null default 10,
  add column wis integer not null default 10,
  add column cha integer not null default 10,
  add column hp_current integer not null default 1,
  add column hp_max integer not null default 1,
  add column notes text not null default '',
  add column avatar_url text;

-- ─── CHARACTER EQUIPMENT ───────────────────────────────────────────────────────

create table public.character_equipment (
  id uuid primary key default gen_random_uuid(),
  character_id uuid references public.characters(id) on delete cascade not null,
  weapon_id uuid references public.weapons(id),
  armor_id uuid references public.armor(id),
  quantity integer not null default 1,
  equipped boolean not null default false,
  constraint equipment_type_check check (
    (weapon_id is not null and armor_id is null) or
    (weapon_id is null and armor_id is not null)
  )
);

-- ─── CHARACTER SPELLS ──────────────────────────────────────────────────────────

create table public.character_spells (
  character_id uuid references public.characters(id) on delete cascade not null,
  spell_id uuid references public.spells(id) on delete cascade not null,
  prepared boolean not null default false,
  primary key (character_id, spell_id)
);

-- ─── RLS ───────────────────────────────────────────────────────────────────────

alter table public.character_equipment enable row level security;
alter table public.character_spells enable row level security;

-- Equipment: access via character ownership
create policy "Users can view their own character equipment"
  on public.character_equipment for select
  using (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Users can insert their own character equipment"
  on public.character_equipment for insert
  with check (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Users can update their own character equipment"
  on public.character_equipment for update
  using (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Users can delete their own character equipment"
  on public.character_equipment for delete
  using (character_id in (select id from public.characters where user_id = auth.uid()));

-- Spells: access via character ownership
create policy "Users can view their own character spells"
  on public.character_spells for select
  using (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Users can insert their own character spells"
  on public.character_spells for insert
  with check (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Users can update their own character spells"
  on public.character_spells for update
  using (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Users can delete their own character spells"
  on public.character_spells for delete
  using (character_id in (select id from public.characters where user_id = auth.uid()));
