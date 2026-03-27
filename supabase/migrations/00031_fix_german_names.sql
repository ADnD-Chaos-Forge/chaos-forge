-- ═══════════════════════════════════════════════════════════════════════════════
-- Fix German Names: Correct AD&D 2e German translations
-- Based on systematic audit against PHB (Players Handbook)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── WEAPONS ─────────────────────────────────────────────────────────────────

-- "Schwerer Flegel" doesn't exist in PHB. PHB has Footman's Flail and
-- Horseman's Flail. "Flegel" already covers Footman's Flail (15gp, 15lb).
-- "Streitflegel" (8gp, 6lb) is closest to Horseman's Flail (8gp, 5lb).
-- Rename "Schwerer Flegel" to "Reiterflegel" (Horseman's Flail) — BUT the
-- stats (1d10/2d4, speed 9, 10lb) don't match Horseman's Flail (1d4+1/1d4+1,
-- speed 6, 5lb) either. The existing "Streitflegel" is closer.
-- Fix: Rename "Schwerer Flegel" to match what it actually is and fix stats,
-- or remove it. Since stats (1d10, 2d4) don't match any PHB flail, we rename
-- it to be clearly identified as a custom/variant entry.
-- Actually, looking more carefully: "Flegel" (Footman's Flail) has wrong damage.
-- PHB: Footman's flail = 1d6+1 / 2d4. DB has 1d6+1 / 2d4 — CORRECT.
-- "Streitflegel" has 2d4 / 1d4+1 — this doesn't match any PHB weapon exactly.
-- We'll leave weapon stats as-is and focus on NAME corrections only.

-- "Streitkolben" = Footman's Mace in PHB (8gp, 10lb, 1d6+1/1d6).
-- DB has cost 12gp — PHB says 8gp. This is a stat issue, not a name issue.
-- German name "Streitkolben" is the standard translation — CORRECT.

-- "Pike" should be German. Standard German AD&D term is "Langspieß" or "Pike".
-- Since "Langspeer" already exists, and "Pike" is also used in German,
-- we keep "Pike" as-is (it's a recognized loanword in German).

-- "Helmvisier (offen)" and "Helmvisier (geschlossen)" are wrong terms.
-- PHB has "Basinet" (open-faced helm) and "Great Helm" (closed helm).
-- German AD&D terms: "Beckenhaube" (Basinet) and "Topfhelm" (Great Helm).
-- However, "Helmvisier" means "visor" which is just a part of a helmet.
-- These are actually "Helm (offen)" and "Helm (geschlossen)" at minimum.
update public.armor set name = 'Beckenhaube' where name = 'Helmvisier (offen)';
update public.armor set name_en = 'Basinet' where name = 'Beckenhaube';

update public.armor set name = 'Topfhelm' where name = 'Helmvisier (geschlossen)';
update public.armor set name_en = 'Great Helm' where name = 'Topfhelm';

-- "Bronzeplatte" should be "Bronzeplattenpanzer" for consistency with
-- "Plattenpanzer", "Kettenpanzer", etc.
update public.armor set name = 'Bronzeplattenpanzer' where name = 'Bronzeplatte';

-- "Fell-/Tierrüstung" — cleaner as "Fellrüstung" (standard German AD&D term
-- for "Hide Armor")
update public.armor set name = 'Fellrüstung' where name = 'Fell-/Tierrüstung';

-- ─── SPELLS ──────────────────────────────────────────────────────────────────

-- "Schwere Wunden Heilen" is listed as level 2 priest spell, but in the PHB
-- "Cure Serious Wounds" is a 4th level priest spell. This is a DATA error.
-- At level 2, there is no "Cure Serious Wounds" — only Aid, Slow Poison, etc.
update public.spells set level = 4
  where name = 'Schwere Wunden Heilen' and spell_type = 'priest';

-- "Magie Identifizieren" — standard German AD&D translation is "Identifizieren"
update public.spells set name = 'Identifizieren'
  where name = 'Magie Identifizieren' and spell_type = 'wizard';
update public.spells set name_en = 'Identify'
  where name = 'Identifizieren' and spell_type = 'wizard';

-- "Geistige Waffe" — PHB spell is "Spiritual Hammer", not "Spiritual Weapon".
-- Standard German AD&D: "Geistiger Hammer"
update public.spells set name = 'Geistiger Hammer'
  where name = 'Geistige Waffe' and spell_type = 'priest';
update public.spells set name_en = 'Spiritual Hammer'
  where name = 'Geistiger Hammer' and spell_type = 'priest';

-- "Fluch Brechen" (wizard L3) — should be "Fluch aufheben" for consistency
-- with the priest version "Fluch Aufheben". Both are "Remove Curse".
-- Actually the wizard version in L3 is correct at "Remove Curse".
-- But there's also "Fluch Brechen (Magier)" at L4 wizard — this is redundant.
-- In PHB, Remove Curse is a 3rd level wizard spell, not 4th.
-- The L4 entry "Fluch Brechen (Magier)" is a duplicate/error.
delete from public.spells
  where name = 'Fluch Brechen (Magier)' and level = 4 and spell_type = 'wizard';

-- "Blitzschlag" — PHB spell is "Lightning Bolt". Standard German: "Blitzstrahl"
-- (not "Blitzschlag" which means "lightning strike" as a natural phenomenon)
update public.spells set name = 'Blitzstrahl'
  where name = 'Blitzschlag' and spell_type = 'wizard';
update public.spells set name_en = 'Lightning Bolt'
  where name = 'Blitzstrahl' and spell_type = 'wizard';

-- "Schutz vor Bösem" (priest L1) and "Schutz vor Bösem (Magier)" (wizard L1)
-- are fine — both are "Protection from Evil" with class-specific variants.

-- "Stille 15 Fuß Radius" — standard German: "Stille, 15' Radius" or
-- "Stille 4,5m Radius". Since the app uses metric display but stores imperial,
-- the name in DB should match the book. Keep as-is.

-- ─── NWP (Non-Weapon Proficiencies) ─────────────────────────────────────────

-- Fix inconsistencies between 00010 seed names and 00023 update names.
-- The 00023 migration tried to set name_en using different German names
-- than what was seeded in 00010, causing silent update failures.

-- Fix German names to match standard AD&D 2e translations AND ensure
-- the name_en values get set properly.

-- "Zimmerei" → "Zimmermannskunst" (matches 00023's expectation and is the
-- standard German AD&D term for "Carpentry")
update public.nonweapon_proficiencies set name = 'Zimmermannskunst' where id = 'carpentry';

-- "Töpferei" → "Töpfern" (matches 00023's expectation)
update public.nonweapon_proficiencies set name = 'Töpfern' where id = 'pottery';

-- "Schneiderei" is fine (matches 00023)
-- "Wetterkunde" → "Wettervorhersage" would match 00023, but "Wetterkunde"
-- is actually the better standard German AD&D term. Fix 00023's expectation
-- instead by setting name_en directly via id.
update public.nonweapon_proficiencies set name_en = 'Weather Sense' where id = 'weather_sense';

-- "Bogenbauer" → keep as "Bogenbauer" (standard term), fix name_en via id
update public.nonweapon_proficiencies set name_en = 'Bowyer/Fletcher' where id = 'bowyer';

-- "Jagen" → "Jagd" would match 00023, but "Jagen" is fine German.
-- Fix name_en via id instead.
update public.nonweapon_proficiencies set name_en = 'Hunting' where id = 'hunting';

-- "Seiltanzen" → keep as-is, fix name_en via id
update public.nonweapon_proficiencies set name_en = 'Tightrope Walking' where id = 'tightrope_walking';

-- "Verkleiden" → keep as-is, fix name_en via id
update public.nonweapon_proficiencies set name_en = 'Disguise' where id = 'disguise';

-- "Fälschen" → keep as-is, fix name_en via id
update public.nonweapon_proficiencies set name_en = 'Forgery' where id = 'forgery';

-- "Edelsteinschliff" → keep as-is, fix name_en via id
update public.nonweapon_proficiencies set name_en = 'Gem Cutting' where id = 'gem_cutting';
update public.nonweapon_proficiencies set name_en = 'Gem Cutting' where id = 'gem_cutting_wiz';

-- "Zauberkunst" → keep as-is, fix name_en via id
update public.nonweapon_proficiencies set name_en = 'Spellcraft' where id = 'spellcraft';
update public.nonweapon_proficiencies set name_en = 'Spellcraft' where id = 'spellcraft_wiz';

-- "Lippenlesen" → keep as-is, fix name_en via id
update public.nonweapon_proficiencies set name_en = 'Reading Lips' where id = 'reading_lips';

-- "Sprachen (modern)" → "Moderne Sprachen" (matches 00023 and standard AD&D)
update public.nonweapon_proficiencies set name = 'Moderne Sprachen' where id = 'languages_modern';

-- "Glücksspiel" is listed under 'rogue' in 00010 but 00023 updates it under
-- warrior context. In PHB, Gaming is a Rogue proficiency. Keep as-is.
-- Fix name_en via id.
update public.nonweapon_proficiencies set name_en = 'Gaming' where id = 'gaming';

-- Missing NWP entries that were referenced in 00023 but never seeded in 00010:
-- These are standard PHB proficiencies that should exist.

-- Artistic Ability (General) — PHB standard
insert into public.nonweapon_proficiencies (id, name, name_en, ability, modifier, group_type, slots_required)
  values ('artistic_ability', 'Künstlerisches Talent', 'Artistic Ability', 'wis', 0, 'general', 1)
  on conflict (id) do nothing;

-- Cobbling (General) — PHB standard
insert into public.nonweapon_proficiencies (id, name, name_en, ability, modifier, group_type, slots_required)
  values ('cobbling', 'Schuhmacherei', 'Cobbling', 'dex', 0, 'general', 1)
  on conflict (id) do nothing;

-- Animal Lore (Warrior) — PHB standard
insert into public.nonweapon_proficiencies (id, name, name_en, ability, modifier, group_type, slots_required)
  values ('animal_lore', 'Tierkunde', 'Animal Lore', 'int', 0, 'warrior', 1)
  on conflict (id) do nothing;

-- Seamanship (General) — PHB standard
insert into public.nonweapon_proficiencies (id, name, name_en, ability, modifier, group_type, slots_required)
  values ('seamanship', 'Seemannschaft', 'Seamanship', 'dex', 1, 'general', 1)
  on conflict (id) do nothing;

-- Stonemasonry (General) — PHB standard
insert into public.nonweapon_proficiencies (id, name, name_en, ability, modifier, group_type, slots_required)
  values ('stonemasonry', 'Steinmetzkunst', 'Stonemasonry', 'str', -2, 'general', 1)
  on conflict (id) do nothing;

-- Riding, Airborne (General) — PHB standard
insert into public.nonweapon_proficiencies (id, name, name_en, ability, modifier, group_type, slots_required)
  values ('riding_airborne', 'Reiten (Luft)', 'Riding, Airborne', 'wis', -2, 'general', 2)
  on conflict (id) do nothing;

-- Locksmithing (Rogue) — referenced in 00023 but never seeded
insert into public.nonweapon_proficiencies (id, name, name_en, ability, modifier, group_type, slots_required)
  values ('locksmithing', 'Schlosserei', 'Locksmithing', 'dex', 0, 'rogue', 1)
  on conflict (id) do nothing;

-- ─── GENERAL ITEMS ───────────────────────────────────────────────────────────

-- "Whetstone" is English — should be "Wetzstein"
update public.general_items set name = 'Wetzstein' where name = 'Whetstone';

-- "Laterne (Stier)" — "Stier" means "bull" literally, but the German AD&D term
-- for "bullseye lantern" is "Blendlaterne" (a lantern with a focused beam)
update public.general_items set name = 'Blendlaterne' where name = 'Laterne (Stier)';

-- "Stachelkette (10 Fuß)" — name_en says "Spike, Iron (10)" but the German
-- name says "Stachelkette" (spiked chain). Should be "Eisennägel (10 Stück)"
-- (iron spikes). "Stachelkette" is a different item.
update public.general_items set name = 'Eisennägel (10 Stück)' where name = 'Stachelkette (10 Fuß)';
