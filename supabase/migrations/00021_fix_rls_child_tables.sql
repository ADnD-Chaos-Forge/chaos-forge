-- ═══════════════════════════════════════════════════════════════════════════════
-- Fix: RLS-Policies für Kindtabellen öffnen
-- Problem: character_equipment, character_spells, character_weapon_proficiencies,
-- character_nonweapon_proficiencies hatten INSERT-Policies die nur den Character-
-- Owner erlaubten. Da alle Characters für alle User sichtbar sind (Dashboard),
-- müssen auch die Kindtabellen für alle authentifizierten User schreibbar sein.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── character_equipment ─────────────────────────────────────────────────────
drop policy if exists "Users can insert their own character equipment" on public.character_equipment;
create policy "Authenticated users can insert character equipment"
  on public.character_equipment for insert
  to authenticated
  with check (true);

drop policy if exists "Users can update their own character equipment" on public.character_equipment;
create policy "Authenticated users can update character equipment"
  on public.character_equipment for update
  to authenticated
  using (true);

drop policy if exists "Users can delete their own character equipment" on public.character_equipment;
create policy "Authenticated users can delete character equipment"
  on public.character_equipment for delete
  to authenticated
  using (true);

-- ─── character_spells ────────────────────────────────────────────────────────
drop policy if exists "Users can view their own character spells" on public.character_spells;
create policy "Authenticated users can view character spells"
  on public.character_spells for select
  to authenticated
  using (true);

drop policy if exists "Users can insert their own character spells" on public.character_spells;
create policy "Authenticated users can insert character spells"
  on public.character_spells for insert
  to authenticated
  with check (true);

drop policy if exists "Users can update their own character spells" on public.character_spells;
create policy "Authenticated users can update character spells"
  on public.character_spells for update
  to authenticated
  using (true);

drop policy if exists "Users can delete their own character spells" on public.character_spells;
create policy "Authenticated users can delete character spells"
  on public.character_spells for delete
  to authenticated
  using (true);

-- ─── character_weapon_proficiencies ──────────────────────────────────────────
drop policy if exists "Users can view their character weapon proficiencies" on public.character_weapon_proficiencies;
create policy "Authenticated users can view weapon proficiencies"
  on public.character_weapon_proficiencies for select
  to authenticated
  using (true);

drop policy if exists "Users can insert their character weapon proficiencies" on public.character_weapon_proficiencies;
create policy "Authenticated users can insert weapon proficiencies"
  on public.character_weapon_proficiencies for insert
  to authenticated
  with check (true);

drop policy if exists "Users can delete their character weapon proficiencies" on public.character_weapon_proficiencies;
create policy "Authenticated users can delete weapon proficiencies"
  on public.character_weapon_proficiencies for delete
  to authenticated
  using (true);

-- ─── character_nonweapon_proficiencies ───────────────────────────────────────
drop policy if exists "Users can view their character NW proficiencies" on public.character_nonweapon_proficiencies;
create policy "Authenticated users can view NW proficiencies"
  on public.character_nonweapon_proficiencies for select
  to authenticated
  using (true);

drop policy if exists "Users can insert their character NW proficiencies" on public.character_nonweapon_proficiencies;
create policy "Authenticated users can insert NW proficiencies"
  on public.character_nonweapon_proficiencies for insert
  to authenticated
  with check (true);

drop policy if exists "Users can delete their character NW proficiencies" on public.character_nonweapon_proficiencies;
create policy "Authenticated users can delete NW proficiencies"
  on public.character_nonweapon_proficiencies for delete
  to authenticated
  using (true);

-- ─── character_languages ─────────────────────────────────────────────────────
drop policy if exists "Users can view their character languages" on public.character_languages;
create policy "Authenticated users can view character languages"
  on public.character_languages for select
  to authenticated
  using (true);

drop policy if exists "Users can insert their character languages" on public.character_languages;
create policy "Authenticated users can insert character languages"
  on public.character_languages for insert
  to authenticated
  with check (true);

drop policy if exists "Users can delete their character languages" on public.character_languages;
create policy "Authenticated users can delete character languages"
  on public.character_languages for delete
  to authenticated
  using (true);
