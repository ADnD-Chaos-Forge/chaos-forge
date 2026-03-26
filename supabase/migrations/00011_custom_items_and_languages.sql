-- ═══════════════════════════════════════════════════════════════════════════════
-- Custom items support + Languages table
-- ═══════════════════════════════════════════════════════════════════════════════

-- Allow user-created weapons
alter table public.weapons
  add column is_custom boolean not null default false,
  add column created_by uuid references public.profiles(id) on delete set null;

-- Allow user-created armor
alter table public.armor
  add column is_custom boolean not null default false,
  add column created_by uuid references public.profiles(id) on delete set null;

-- Allow user-created spells
alter table public.spells
  add column is_custom boolean not null default false,
  add column created_by uuid references public.profiles(id) on delete set null;

-- Allow user-created non-weapon proficiencies
alter table public.nonweapon_proficiencies
  add column is_custom boolean not null default false,
  add column created_by uuid references public.profiles(id) on delete set null;

-- Update RLS: authenticated users can insert custom items
create policy "Authenticated users can create custom weapons"
  on public.weapons for insert
  with check (auth.role() = 'authenticated' and is_custom = true);

create policy "Users can update their custom weapons"
  on public.weapons for update
  using (is_custom = true and created_by = auth.uid());

create policy "Users can delete their custom weapons"
  on public.weapons for delete
  using (is_custom = true and created_by = auth.uid());

create policy "Authenticated users can create custom armor"
  on public.armor for insert
  with check (auth.role() = 'authenticated' and is_custom = true);

create policy "Users can update their custom armor"
  on public.armor for update
  using (is_custom = true and created_by = auth.uid());

create policy "Users can delete their custom armor"
  on public.armor for delete
  using (is_custom = true and created_by = auth.uid());

create policy "Authenticated users can create custom spells"
  on public.spells for insert
  with check (auth.role() = 'authenticated' and is_custom = true);

create policy "Users can update their custom spells"
  on public.spells for update
  using (is_custom = true and created_by = auth.uid());

create policy "Users can delete their custom spells"
  on public.spells for delete
  using (is_custom = true and created_by = auth.uid());

create policy "Authenticated users can create custom NWPs"
  on public.nonweapon_proficiencies for insert
  with check (auth.role() = 'authenticated' and is_custom = true);

create policy "Users can delete their custom NWPs"
  on public.nonweapon_proficiencies for delete
  using (is_custom = true and created_by = auth.uid());

-- ─── CHARACTER LANGUAGES ───────────────────────────────────────────────────────

create table public.character_languages (
  id uuid primary key default gen_random_uuid(),
  character_id uuid references public.characters(id) on delete cascade not null,
  language_name text not null,
  unique(character_id, language_name)
);

alter table public.character_languages enable row level security;

create policy "Users can view their character languages"
  on public.character_languages for select
  using (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Users can insert their character languages"
  on public.character_languages for insert
  with check (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Users can delete their character languages"
  on public.character_languages for delete
  using (character_id in (select id from public.characters where user_id = auth.uid()));
