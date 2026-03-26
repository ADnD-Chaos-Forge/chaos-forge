-- ═══════════════════════════════════════════════════════════════════════════════
-- RLS: Owner-basierte Policies — eigene Chars editierbar, fremde read-only
-- Revertiert 00021 und setzt korrekte Owner-Policies
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── character_equipment ─────────────────────────────────────────────────────
drop policy if exists "Authenticated users can insert character equipment" on public.character_equipment;
drop policy if exists "Authenticated users can update character equipment" on public.character_equipment;
drop policy if exists "Authenticated users can delete character equipment" on public.character_equipment;

create policy "Owner can insert character equipment"
  on public.character_equipment for insert to authenticated
  with check (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Owner can update character equipment"
  on public.character_equipment for update to authenticated
  using (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Owner can delete character equipment"
  on public.character_equipment for delete to authenticated
  using (character_id in (select id from public.characters where user_id = auth.uid()));

-- ─── character_spells ────────────────────────────────────────────────────────
drop policy if exists "Authenticated users can view character spells" on public.character_spells;
drop policy if exists "Authenticated users can insert character spells" on public.character_spells;
drop policy if exists "Authenticated users can update character spells" on public.character_spells;
drop policy if exists "Authenticated users can delete character spells" on public.character_spells;

create policy "All authenticated can view character spells"
  on public.character_spells for select to authenticated using (true);

create policy "Owner can insert character spells"
  on public.character_spells for insert to authenticated
  with check (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Owner can update character spells"
  on public.character_spells for update to authenticated
  using (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Owner can delete character spells"
  on public.character_spells for delete to authenticated
  using (character_id in (select id from public.characters where user_id = auth.uid()));

-- ─── character_weapon_proficiencies ──────────────────────────────────────────
drop policy if exists "Authenticated users can view weapon proficiencies" on public.character_weapon_proficiencies;
drop policy if exists "Authenticated users can insert weapon proficiencies" on public.character_weapon_proficiencies;
drop policy if exists "Authenticated users can delete weapon proficiencies" on public.character_weapon_proficiencies;

create policy "All authenticated can view weapon proficiencies"
  on public.character_weapon_proficiencies for select to authenticated using (true);

create policy "Owner can insert weapon proficiencies"
  on public.character_weapon_proficiencies for insert to authenticated
  with check (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Owner can delete weapon proficiencies"
  on public.character_weapon_proficiencies for delete to authenticated
  using (character_id in (select id from public.characters where user_id = auth.uid()));

-- ─── character_nonweapon_proficiencies ───────────────────────────────────────
drop policy if exists "Authenticated users can view NW proficiencies" on public.character_nonweapon_proficiencies;
drop policy if exists "Authenticated users can insert NW proficiencies" on public.character_nonweapon_proficiencies;
drop policy if exists "Authenticated users can delete NW proficiencies" on public.character_nonweapon_proficiencies;

create policy "All authenticated can view NW proficiencies"
  on public.character_nonweapon_proficiencies for select to authenticated using (true);

create policy "Owner can insert NW proficiencies"
  on public.character_nonweapon_proficiencies for insert to authenticated
  with check (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Owner can delete NW proficiencies"
  on public.character_nonweapon_proficiencies for delete to authenticated
  using (character_id in (select id from public.characters where user_id = auth.uid()));

-- ─── character_languages ─────────────────────────────────────────────────────
drop policy if exists "Authenticated users can view character languages" on public.character_languages;
drop policy if exists "Authenticated users can insert character languages" on public.character_languages;
drop policy if exists "Authenticated users can delete character languages" on public.character_languages;

create policy "All authenticated can view character languages"
  on public.character_languages for select to authenticated using (true);

create policy "Owner can insert character languages"
  on public.character_languages for insert to authenticated
  with check (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Owner can delete character languages"
  on public.character_languages for delete to authenticated
  using (character_id in (select id from public.characters where user_id = auth.uid()));
