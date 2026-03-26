-- ═══════════════════════════════════════════════════════════════════════════════
-- Epic 2: Seed Data — Races, Classes, Weapons, Armor, Spells
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── RACES ─────────────────────────────────────────────────────────────────────

insert into public.races (id, name, ability_adjustments, infravision, ability_minimums, ability_maximums) values
  ('human',    'Mensch',    '{}',                              0,  '{}',                        '{}'),
  ('elf',      'Elf',       '{"dex": 1, "con": -1}',          60, '{"int": 8, "dex": 6}',      '{"con": 17}'),
  ('half_elf', 'Halbelf',   '{}',                              30, '{"int": 4, "con": 4}',      '{}'),
  ('dwarf',    'Zwerg',     '{"con": 1, "cha": -1}',          60, '{"str": 8, "con": 11}',     '{"cha": 16}'),
  ('gnome',    'Gnom',      '{"int": 1, "wis": -1}',          60, '{"int": 6, "con": 8}',      '{"str": 17, "wis": 17}'),
  ('halfling', 'Halbling',  '{"dex": 1, "str": -1}',          30, '{"dex": 7, "con": 10, "str": 7}', '{"str": 17, "wis": 17}'),
  ('half_orc', 'Halb-Ork',  '{"str": 1, "con": 1, "cha": -2}',60, '{"str": 6, "con": 13}',     '{"int": 17, "wis": 14, "cha": 12}');

-- ─── CLASSES ───────────────────────────────────────────────────────────────────

insert into public.classes (id, name, class_group, hit_die, ability_requirements, prime_requisites, exceptional_strength) values
  ('fighter',     'Kämpfer',       'warrior', 10, '{"str": 9}',                              '{"str"}',         true),
  ('ranger',      'Waldläufer',    'warrior', 10, '{"str": 13, "dex": 13, "con": 14, "wis": 14}', '{"str","dex","wis"}', true),
  ('paladin',     'Paladin',       'warrior', 10, '{"str": 12, "con": 9, "wis": 13, "cha": 17}',  '{"str","cha"}',       true),
  ('mage',        'Magier',        'wizard',   4, '{"int": 9}',                              '{"int"}',         false),
  ('abjurer',     'Bannzauberer',  'wizard',   4, '{"int": 9, "wis": 15}',                   '{"int"}',         false),
  ('conjurer',    'Beschwörer',    'wizard',   4, '{"int": 9, "con": 15}',                   '{"int"}',         false),
  ('diviner',     'Seher',         'wizard',   4, '{"int": 9, "wis": 16}',                   '{"int"}',         false),
  ('enchanter',   'Verzauberer',   'wizard',   4, '{"int": 9, "cha": 16}',                   '{"int"}',         false),
  ('illusionist', 'Illusionist',   'wizard',   4, '{"int": 9, "dex": 16}',                   '{"int"}',         false),
  ('invoker',     'Anrufer',       'wizard',   4, '{"int": 9, "con": 16}',                   '{"int"}',         false),
  ('necromancer', 'Nekromant',     'wizard',   4, '{"int": 9, "wis": 16}',                   '{"int"}',         false),
  ('transmuter',  'Verwandler',    'wizard',   4, '{"int": 9, "dex": 15}',                   '{"int"}',         false),
  ('cleric',      'Kleriker',      'priest',   8, '{"wis": 9}',                              '{"wis"}',         false),
  ('druid',       'Druide',        'priest',   8, '{"wis": 12, "cha": 15}',                  '{"wis","cha"}',   false),
  ('thief',       'Dieb',          'rogue',    6, '{"dex": 9}',                              '{"dex"}',         false),
  ('bard',        'Barde',         'rogue',    6, '{"dex": 12, "int": 13, "cha": 15}',       '{"dex","cha"}',   false);

-- ─── RACE/CLASS RESTRICTIONS ───────────────────────────────────────────────────
-- Humans: all classes, unlimited
insert into public.race_class_restrictions (race_id, class_id, level_limit)
  select 'human', id, null from public.classes;

-- Elves
insert into public.race_class_restrictions (race_id, class_id, level_limit) values
  ('elf', 'fighter', 12), ('elf', 'ranger', 15),
  ('elf', 'mage', 15), ('elf', 'abjurer', 15), ('elf', 'conjurer', 15),
  ('elf', 'diviner', 15), ('elf', 'enchanter', 15), ('elf', 'illusionist', 15),
  ('elf', 'invoker', 15), ('elf', 'necromancer', 15), ('elf', 'transmuter', 15),
  ('elf', 'cleric', 12), ('elf', 'thief', 12);

-- Half-Elves
insert into public.race_class_restrictions (race_id, class_id, level_limit) values
  ('half_elf', 'fighter', 14), ('half_elf', 'ranger', 16),
  ('half_elf', 'mage', 12), ('half_elf', 'abjurer', 12), ('half_elf', 'conjurer', 12),
  ('half_elf', 'diviner', 12), ('half_elf', 'enchanter', 12), ('half_elf', 'illusionist', 12),
  ('half_elf', 'invoker', 12), ('half_elf', 'necromancer', 12), ('half_elf', 'transmuter', 12),
  ('half_elf', 'cleric', 14), ('half_elf', 'druid', 9),
  ('half_elf', 'thief', 12), ('half_elf', 'bard', 12);

-- Dwarves
insert into public.race_class_restrictions (race_id, class_id, level_limit) values
  ('dwarf', 'fighter', 15), ('dwarf', 'cleric', 10), ('dwarf', 'thief', 12);

-- Gnomes
insert into public.race_class_restrictions (race_id, class_id, level_limit) values
  ('gnome', 'fighter', 11), ('gnome', 'illusionist', 15),
  ('gnome', 'cleric', 9), ('gnome', 'thief', 13);

-- Halflings
insert into public.race_class_restrictions (race_id, class_id, level_limit) values
  ('halfling', 'fighter', 9), ('halfling', 'cleric', 8), ('halfling', 'thief', 15);

-- Half-Orcs
insert into public.race_class_restrictions (race_id, class_id, level_limit) values
  ('half_orc', 'fighter', 12), ('half_orc', 'cleric', 4), ('half_orc', 'thief', 8);

-- ─── ARMOR ─────────────────────────────────────────────────────────────────────

insert into public.armor (name, ac, weight, cost_gp, max_movement) values
  ('Keine Rüstung',      10,  0.0,    0.0, 12),
  ('Schild',              9,  5.0,   10.0, 12),
  ('Lederrüstung',        8, 15.0,    5.0, 12),
  ('Beschlagenes Leder',  7, 25.0,   20.0, 12),
  ('Ringpanzer',          7, 30.0,  100.0,  9),
  ('Schuppenpanzer',      6, 40.0,  120.0,  6),
  ('Kettenpanzer',        5, 40.0,   75.0,  9),
  ('Schienenpanzer',      4, 45.0,   80.0,  9),
  ('Bänderpanzer',        4, 35.0,  200.0,  9),
  ('Plattenpanzer',       3, 45.0,  400.0,  6),
  ('Feldrüstung',         2, 55.0, 2000.0,  6),
  ('Volle Plattenrüstung',1, 70.0,10000.0,  6);

-- ─── WEAPONS ───────────────────────────────────────────────────────────────────

insert into public.weapons (name, damage_sm, damage_l, weapon_type, speed, weight, cost_gp, range_short, range_medium, range_long) values
  ('Dolch',            '1d4',  '1d3',  'both',   2,  1.0,   2.0,  10, 20, 30),
  ('Kurzschwert',      '1d6',  '1d8',  'melee',  3,  3.0,  10.0,  null, null, null),
  ('Langschwert',      '1d8',  '1d12', 'melee',  5,  4.0,  15.0,  null, null, null),
  ('Zweihänder',       '1d10', '3d6',  'melee',  10, 15.0, 50.0,  null, null, null),
  ('Streitaxt',        '1d8',  '1d8',  'melee',  7,  7.0,  10.0,  null, null, null),
  ('Streitkolben',     '1d6+1','1d6',  'melee',  7,  10.0, 12.0,  null, null, null),
  ('Morgenstern',      '2d4',  '1d6+1','melee',  7,  12.0, 10.0,  null, null, null),
  ('Kriegshammer',     '1d4+1','1d4',  'melee',  4,  6.0,   2.0,  null, null, null),
  ('Speer',            '1d6',  '1d8',  'both',   6,  5.0,   1.0,  10, 20, 30),
  ('Hellebarde',       '1d10', '2d6',  'melee',  9,  15.0, 10.0,  null, null, null),
  ('Kurzbogen',        '1d6',  '1d6',  'ranged', 7,  2.0,  30.0,  50, 100, 150),
  ('Langbogen',        '1d6',  '1d6',  'ranged', 8,  3.0,  75.0,  70, 140, 210),
  ('Leichte Armbrust', '1d4',  '1d4',  'ranged', 7,  7.0,  35.0,  60, 120, 180),
  ('Schwere Armbrust', '1d4+1','1d6+1','ranged', 10, 14.0, 50.0,  80, 160, 240),
  ('Schleuder',        '1d4',  '1d4',  'ranged', 6,  1.0,   0.1,  40, 80, 160),
  ('Kampfstab',        '1d6',  '1d6',  'melee',  4,  4.0,   0.0,  null, null, null);

-- ─── SPELLS (Sample — 5-10 per class) ──────────────────────────────────────────

-- Wizard Spells (Level 1-3 samples)
insert into public.spells (name, level, spell_type, school, range, duration, area_of_effect, components, description) values
  ('Magisches Geschoss',  1, 'wizard', 'invocation',  '60 Fuß + 10 Fuß/Stufe', 'Sofort',           '1-5 Geschosse', '{"V","S"}',   'Erzeugt magische Geschosse, die automatisch treffen. 1d4+1 Schaden pro Geschoss.'),
  ('Schlaf',              1, 'wizard', 'enchantment', '30 Fuß',                 '5 Runden/Stufe',   '30 Fuß Radius', '{"V","S","M"}','Versetzt Kreaturen in magischen Schlaf. Betrifft bis zu 2d4 TW an Kreaturen.'),
  ('Schild',              1, 'wizard', 'abjuration',  '0',                      '5 Runden/Stufe',   'Zauberer',       '{"V","S"}',   'Erzeugt unsichtbaren Schild. AC 2 gegen Geschosse, AC 4 gegen andere Angriffe.'),
  ('Magie Identifizieren',1, 'wizard', 'divination',  'Berührung',              'Sofort',           '1 Gegenstand',   '{"V","S","M"}','Identifiziert magische Eigenschaften eines Gegenstandes.'),
  ('Unsichtbarkeit',      2, 'wizard', 'illusion',    'Berührung',              'Speziell',         '1 Kreatur',      '{"V","S","M"}','Macht Ziel unsichtbar bis es angreift oder zaubert.'),
  ('Klopfen',             2, 'wizard', 'alteration',  '60 Fuß',                 'Speziell',         '10 qm/Stufe',    '{"V"}',       'Öffnet verschlossene, verkeilte oder magisch versiegelte Türen.'),
  ('Feuerball',           3, 'wizard', 'invocation',  '100 Fuß + 10 Fuß/Stufe','Sofort',           '20 Fuß Radius',  '{"V","S","M"}','Feuerexplosion. 1d6 Schaden pro Zauberstufe (max 10d6).'),
  ('Blitzschlag',         3, 'wizard', 'invocation',  '40 Fuß + 10 Fuß/Stufe', 'Sofort',           'Speziell',       '{"V","S","M"}','Blitzstrahl. 1d6 Schaden pro Zauberstufe (max 10d6).'),
  ('Fluch Brechen',       3, 'wizard', 'abjuration',  'Berührung',              'Permanent',        'Speziell',       '{"V","S"}',   'Entfernt einen Fluch von einer Kreatur oder einem Gegenstand.');

-- Priest Spells (Level 1-3 samples)
insert into public.spells (name, level, spell_type, sphere, range, duration, area_of_effect, components, description) values
  ('Leichte Wunden Heilen', 1, 'priest', 'healing',    'Berührung',  'Permanent',       '1 Kreatur',    '{"V","S"}',   'Heilt 1d8 Trefferpunkte.'),
  ('Segen',                 1, 'priest', 'all',        '60 Fuß',    '6 Runden',        'Spezial',      '{"V","S","M"}','Verbündete erhalten +1 auf Moral und Angriffswürfe.'),
  ('Licht',                 1, 'priest', 'sun',        '120 Fuß',   '1 Stunde + 1 Runde/Stufe', '20 Fuß Radius', '{"V","S"}', 'Erzeugt helles Licht in einem Bereich.'),
  ('Schutz vor Bösem',      1, 'priest', 'protection', '0',         '3 Runden/Stufe',  'Zauberer',     '{"V","S","M"}','Schützt vor Angriffen böser Kreaturen. +2 RW, -2 auf feindliche Angriffe.'),
  ('Stille 15 Fuß Radius', 2, 'priest', 'guardian',   '120 Fuß',   '2 Runden/Stufe',  '15 Fuß Radius','{"V","S"}',   'Erzeugt absolute Stille. Verhindert Zauber mit verbaler Komponente.'),
  ('Geistige Waffe',        2, 'priest', 'creation',   '0',         '3 Runden + 1 Runde/Stufe', 'Spezial', '{"V","S","M"}','Erzeugt schwebende Waffe die eigenständig angreift.'),
  ('Schwere Wunden Heilen', 2, 'priest', 'healing',    'Berührung',  'Permanent',       '1 Kreatur',    '{"V","S"}',   'Heilt 2d8+1 Trefferpunkte.'),
  ('Gebet',                 3, 'priest', 'combat',     '0',         '1 Runde/Stufe',   '60 Fuß Radius','{"V","S","M"}','Verbündete +1, Feinde -1 auf Angriff, Schaden und Rettungswürfe.'),
  ('Fluch Aufheben',        3, 'priest', 'protection', 'Berührung',  'Permanent',       'Spezial',      '{"V","S"}',   'Entfernt einen Fluch von einer Kreatur oder einem Gegenstand.');
