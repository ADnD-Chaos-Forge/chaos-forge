-- ═══════════════════════════════════════════════════════════════════════════════
-- AP6: Bilingual content — English as standard, German as translation
-- ═══════════════════════════════════════════════════════════════════════════════

-- Add English name columns (English is the standard from the books)
alter table public.weapons add column name_en text;
alter table public.armor add column name_en text;
alter table public.spells add column name_en text;
alter table public.spells add column description_en text;
alter table public.nonweapon_proficiencies add column name_en text;
alter table public.races add column name_en text;
alter table public.classes add column name_en text;

-- Rename existing German 'name' to keep it, set English originals
-- We'll keep 'name' as the German display name and 'name_en' as English original

-- ─── RACES ─────────────────────────────────────────────────────────────────────
update public.races set name_en = 'Human' where id = 'human';
update public.races set name_en = 'Elf' where id = 'elf';
update public.races set name_en = 'Half-Elf' where id = 'half_elf';
update public.races set name_en = 'Dwarf' where id = 'dwarf';
update public.races set name_en = 'Gnome' where id = 'gnome';
update public.races set name_en = 'Halfling' where id = 'halfling';
update public.races set name_en = 'Half-Orc' where id = 'half_orc';

-- ─── CLASSES ───────────────────────────────────────────────────────────────────
update public.classes set name_en = 'Fighter' where id = 'fighter';
update public.classes set name_en = 'Ranger' where id = 'ranger';
update public.classes set name_en = 'Paladin' where id = 'paladin';
update public.classes set name_en = 'Mage' where id = 'mage';
update public.classes set name_en = 'Abjurer' where id = 'abjurer';
update public.classes set name_en = 'Conjurer' where id = 'conjurer';
update public.classes set name_en = 'Diviner' where id = 'diviner';
update public.classes set name_en = 'Enchanter' where id = 'enchanter';
update public.classes set name_en = 'Illusionist' where id = 'illusionist';
update public.classes set name_en = 'Invoker' where id = 'invoker';
update public.classes set name_en = 'Necromancer' where id = 'necromancer';
update public.classes set name_en = 'Transmuter' where id = 'transmuter';
update public.classes set name_en = 'Cleric' where id = 'cleric';
update public.classes set name_en = 'Druid' where id = 'druid';
update public.classes set name_en = 'Thief' where id = 'thief';
update public.classes set name_en = 'Bard' where id = 'bard';
