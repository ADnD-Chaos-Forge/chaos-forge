-- ═══════════════════════════════════════════════════════════════════════════════
-- Sub-Epic D: Proficiency System
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── REFERENCE TABLES ──────────────────────────────────────────────────────────

create table public.nonweapon_proficiencies (
  id text primary key,
  name text not null,
  ability text not null,
  modifier integer not null default 0,
  group_type text not null check (group_type in ('general', 'warrior', 'priest', 'rogue', 'wizard')),
  slots_required integer not null default 1
);

-- ─── CHARACTER JUNCTION TABLES ─────────────────────────────────────────────────

create table public.character_weapon_proficiencies (
  id uuid primary key default gen_random_uuid(),
  character_id uuid references public.characters(id) on delete cascade not null,
  weapon_name text not null,
  specialization boolean not null default false,
  unique(character_id, weapon_name)
);

create table public.character_nonweapon_proficiencies (
  id uuid primary key default gen_random_uuid(),
  character_id uuid references public.characters(id) on delete cascade not null,
  proficiency_id text references public.nonweapon_proficiencies(id) not null,
  unique(character_id, proficiency_id)
);

-- ─── RLS ───────────────────────────────────────────────────────────────────────

alter table public.nonweapon_proficiencies enable row level security;
alter table public.character_weapon_proficiencies enable row level security;
alter table public.character_nonweapon_proficiencies enable row level security;

-- Reference data readable by all
create policy "NWP reference data readable by authenticated users"
  on public.nonweapon_proficiencies for select
  using (auth.role() = 'authenticated');

-- Character proficiencies via character ownership
create policy "Users can view their character weapon proficiencies"
  on public.character_weapon_proficiencies for select
  using (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Users can insert their character weapon proficiencies"
  on public.character_weapon_proficiencies for insert
  with check (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Users can delete their character weapon proficiencies"
  on public.character_weapon_proficiencies for delete
  using (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Users can view their character NW proficiencies"
  on public.character_nonweapon_proficiencies for select
  using (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Users can insert their character NW proficiencies"
  on public.character_nonweapon_proficiencies for insert
  with check (character_id in (select id from public.characters where user_id = auth.uid()));

create policy "Users can delete their character NW proficiencies"
  on public.character_nonweapon_proficiencies for delete
  using (character_id in (select id from public.characters where user_id = auth.uid()));

-- ─── SEED NON-WEAPON PROFICIENCIES ────────────────────────────────────────────

insert into public.nonweapon_proficiencies (id, name, ability, modifier, group_type, slots_required) values
  -- General
  ('agriculture', 'Landwirtschaft', 'int', 0, 'general', 1),
  ('animal_handling', 'Tierführung', 'wis', -1, 'general', 1),
  ('animal_training', 'Tierabrichtung', 'wis', 0, 'general', 1),
  ('blacksmithing', 'Schmieden', 'str', 0, 'general', 1),
  ('brewing', 'Brauen', 'int', 0, 'general', 1),
  ('carpentry', 'Zimmerei', 'str', 0, 'general', 1),
  ('cooking', 'Kochen', 'int', 0, 'general', 1),
  ('dancing', 'Tanzen', 'dex', 0, 'general', 1),
  ('direction_sense', 'Orientierungssinn', 'wis', 1, 'general', 1),
  ('etiquette', 'Etikette', 'cha', 0, 'general', 1),
  ('fire_building', 'Feuer machen', 'wis', -1, 'general', 1),
  ('fishing', 'Fischen', 'wis', -1, 'general', 1),
  ('heraldry', 'Heraldik', 'int', 0, 'general', 1),
  ('languages_modern', 'Sprachen (modern)', 'int', 0, 'general', 1),
  ('leatherworking', 'Lederverarbeitung', 'int', 0, 'general', 1),
  ('mining', 'Bergbau', 'wis', 0, 'general', 2),
  ('navigation', 'Navigation', 'int', -2, 'general', 1),
  ('pottery', 'Töpferei', 'dex', -2, 'general', 1),
  ('riding_land', 'Reiten (Land)', 'wis', 3, 'general', 1),
  ('rope_use', 'Seilkunst', 'dex', 0, 'general', 1),
  ('seamstress', 'Schneiderei', 'dex', -1, 'general', 1),
  ('singing', 'Singen', 'cha', 0, 'general', 1),
  ('swimming', 'Schwimmen', 'str', 0, 'general', 1),
  ('weather_sense', 'Wetterkunde', 'wis', -1, 'general', 1),
  ('weaving', 'Weben', 'int', -1, 'general', 1),
  -- Warrior
  ('armorer', 'Rüstungsschmied', 'int', -2, 'warrior', 2),
  ('blind_fighting', 'Blindkampf', 'wis', 0, 'warrior', 2),
  ('bowyer', 'Bogenbauer', 'dex', -1, 'warrior', 1),
  ('endurance', 'Ausdauer', 'con', 0, 'warrior', 2),
  ('hunting', 'Jagen', 'wis', -1, 'warrior', 1),
  ('mountaineering', 'Bergsteigen', 'str', 0, 'warrior', 1),
  ('running', 'Laufen', 'con', -6, 'warrior', 1),
  ('set_snares', 'Fallen stellen', 'dex', -1, 'warrior', 1),
  ('survival', 'Überleben', 'int', 0, 'warrior', 2),
  ('tracking', 'Fährtensuche', 'wis', 0, 'warrior', 2),
  ('weaponsmithing', 'Waffenschmied', 'int', -3, 'warrior', 3),
  -- Priest
  ('ancient_languages', 'Alte Sprachen', 'int', 0, 'priest', 1),
  ('healing', 'Heilen', 'wis', -2, 'priest', 2),
  ('herbalism', 'Kräuterkunde', 'int', -2, 'priest', 2),
  ('local_history', 'Lokale Geschichte', 'cha', 0, 'priest', 1),
  ('musical_instrument', 'Musikinstrument', 'dex', -1, 'priest', 1),
  ('reading_writing', 'Lesen/Schreiben', 'int', 1, 'priest', 1),
  ('religion', 'Religion', 'wis', 0, 'priest', 1),
  ('spellcraft', 'Zauberkunst', 'int', -2, 'priest', 1),
  -- Rogue
  ('appraising', 'Schätzen', 'int', 0, 'rogue', 1),
  ('disguise', 'Verkleiden', 'cha', -1, 'rogue', 1),
  ('forgery', 'Fälschen', 'dex', -1, 'rogue', 1),
  ('gaming', 'Glücksspiel', 'cha', 0, 'rogue', 1),
  ('gem_cutting', 'Edelsteinschliff', 'dex', -2, 'rogue', 2),
  ('juggling', 'Jonglieren', 'dex', -1, 'rogue', 1),
  ('jumping', 'Springen', 'str', 0, 'rogue', 1),
  ('reading_lips', 'Lippenlesen', 'int', -2, 'rogue', 2),
  ('tightrope_walking', 'Seiltanzen', 'dex', 0, 'rogue', 1),
  ('tumbling', 'Akrobatik', 'dex', 0, 'rogue', 1),
  ('ventriloquism', 'Bauchreden', 'int', -2, 'rogue', 1),
  -- Wizard
  ('ancient_history', 'Alte Geschichte', 'int', -1, 'wizard', 1),
  ('astrology', 'Astrologie', 'int', 0, 'wizard', 2),
  ('engineering', 'Ingenieurskunst', 'int', -3, 'wizard', 2),
  ('gem_cutting_wiz', 'Edelsteinschliff', 'dex', -2, 'wizard', 2),
  ('languages_ancient', 'Alte Sprachen', 'int', 0, 'wizard', 1),
  ('reading_writing_wiz', 'Lesen/Schreiben', 'int', 1, 'wizard', 1),
  ('religion_wiz', 'Religion', 'wis', 0, 'wizard', 1),
  ('spellcraft_wiz', 'Zauberkunst', 'int', -2, 'wizard', 1);
