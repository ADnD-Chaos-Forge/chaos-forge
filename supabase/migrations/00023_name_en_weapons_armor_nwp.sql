-- ═══════════════════════════════════════════════════════════════════════════════
-- Bilingual: name_en für Waffen, Rüstungen und NW-Fertigkeiten
-- ═══════════════════════════════════════════════════════════════════════════════

-- Weapons: name_en column
alter table public.weapons add column if not exists name_en text;

-- Armor: name_en column
alter table public.armor add column if not exists name_en text;

-- NWP: name_en column
alter table public.nonweapon_proficiencies add column if not exists name_en text;

-- ═══════════════════════════════════════════════════════════════════════════════
-- Weapons English names
-- ═══════════════════════════════════════════════════════════════════════════════
update public.weapons set name_en = 'Dagger' where name = 'Dolch';
update public.weapons set name_en = 'Short Sword' where name = 'Kurzschwert';
update public.weapons set name_en = 'Long Sword' where name = 'Langschwert';
update public.weapons set name_en = 'Two-Handed Sword' where name = 'Zweihänder';
update public.weapons set name_en = 'Battle Axe' where name = 'Streitaxt';
update public.weapons set name_en = 'Mace' where name = 'Streitkolben';
update public.weapons set name_en = 'Morning Star' where name = 'Morgenstern';
update public.weapons set name_en = 'War Hammer' where name = 'Kriegshammer';
update public.weapons set name_en = 'Spear' where name = 'Speer';
update public.weapons set name_en = 'Halberd' where name = 'Hellebarde';
update public.weapons set name_en = 'Short Bow' where name = 'Kurzbogen';
update public.weapons set name_en = 'Long Bow' where name = 'Langbogen';
update public.weapons set name_en = 'Light Crossbow' where name = 'Leichte Armbrust';
update public.weapons set name_en = 'Heavy Crossbow' where name = 'Schwere Armbrust';
update public.weapons set name_en = 'Sling' where name = 'Schleuder';
update public.weapons set name_en = 'Quarterstaff' where name = 'Kampfstab';
update public.weapons set name_en = 'Hand Axe' where name = 'Handaxt';
update public.weapons set name_en = 'Throwing Axe' where name = 'Wurfaxt';
update public.weapons set name_en = 'Broad Sword' where name = 'Breitschwert';
update public.weapons set name_en = 'Bastard Sword' where name = 'Bastardschwert';
update public.weapons set name_en = 'Scimitar' where name = 'Krummsäbel';
update public.weapons set name_en = 'Rapier' where name = 'Rapier';
update public.weapons set name_en = 'Flail' where name = 'Flegel';
update public.weapons set name_en = 'Heavy Flail' where name = 'Schwerer Flegel';
update public.weapons set name_en = 'Light Lance' where name = 'Lanze (leicht)';
update public.weapons set name_en = 'Heavy Lance' where name = 'Lanze (schwer)';
update public.weapons set name_en = 'Pike' where name = 'Pike';
update public.weapons set name_en = 'Trident' where name = 'Dreizack';
update public.weapons set name_en = 'Scythe' where name = 'Sense';
update public.weapons set name_en = 'Sickle' where name = 'Sichel';
update public.weapons set name_en = 'Club' where name = 'Knüppel';
update public.weapons set name_en = 'Whip' where name = 'Peitsche';
update public.weapons set name_en = 'Throwing Knife' where name = 'Wurfmesser';
update public.weapons set name_en = 'Blowgun' where name = 'Blasrohr';
update public.weapons set name_en = 'Throwing Net' where name = 'Wurfnetz';
update public.weapons set name_en = 'Bola' where name = 'Bola';
update public.weapons set name_en = 'Composite Short Bow' where name = 'Kompositbogen (kurz)';
update public.weapons set name_en = 'Composite Long Bow' where name = 'Kompositbogen (lang)';
update public.weapons set name_en = 'Caltrops' where name = 'Fußangeln';
update public.weapons set name_en = 'Footman''s Flail' where name = 'Streitflegel';
update public.weapons set name_en = 'Glaive' where name = 'Gleve';
update public.weapons set name_en = 'Guisarme' where name = 'Guisarme';
update public.weapons set name_en = 'Long Spear' where name = 'Langspeer';
update public.weapons set name_en = 'Nunchaku' where name = 'Nunchaku';
update public.weapons set name_en = 'Throwing Star' where name = 'Wurfstern';
update public.weapons set name_en = 'Two-Handed Battle Axe' where name = 'Zweihändige Streitaxt';

-- ═══════════════════════════════════════════════════════════════════════════════
-- Armor English names
-- ═══════════════════════════════════════════════════════════════════════════════
update public.armor set name_en = 'No Armor' where name = 'Keine Rüstung';
update public.armor set name_en = 'Shield' where name = 'Schild';
update public.armor set name_en = 'Leather Armor' where name = 'Lederrüstung';
update public.armor set name_en = 'Studded Leather' where name = 'Beschlagenes Leder';
update public.armor set name_en = 'Ring Mail' where name = 'Ringpanzer';
update public.armor set name_en = 'Scale Mail' where name = 'Schuppenpanzer';
update public.armor set name_en = 'Chain Mail' where name = 'Kettenpanzer';
update public.armor set name_en = 'Splint Mail' where name = 'Schienenpanzer';
update public.armor set name_en = 'Banded Mail' where name = 'Bänderpanzer';
update public.armor set name_en = 'Plate Mail' where name = 'Plattenpanzer';
update public.armor set name_en = 'Field Plate' where name = 'Feldrüstung';
update public.armor set name_en = 'Full Plate' where name = 'Volle Plattenrüstung';
update public.armor set name_en = 'Padded Armor' where name = 'Gepolsterte Rüstung';
update public.armor set name_en = 'Hide Armor' where name = 'Fell-/Tierrüstung';
update public.armor set name_en = 'Bronze Plate' where name = 'Bronzeplatte';
update public.armor set name_en = 'Elven Chain Mail' where name = 'Elfisches Kettenhemd';
update public.armor set name_en = 'Large Shield' where name = 'Großer Schild';
update public.armor set name_en = 'Buckler' where name = 'Buckler';
update public.armor set name_en = 'Helm (open)' where name = 'Helmvisier (offen)';
update public.armor set name_en = 'Helm (closed)' where name = 'Helmvisier (geschlossen)';

-- ═══════════════════════════════════════════════════════════════════════════════
-- NWP English names
-- ═══════════════════════════════════════════════════════════════════════════════
update public.nonweapon_proficiencies set name_en = 'Agriculture' where name = 'Landwirtschaft';
update public.nonweapon_proficiencies set name_en = 'Animal Handling' where name = 'Tierführung';
update public.nonweapon_proficiencies set name_en = 'Animal Training' where name = 'Tierabrichtung';
update public.nonweapon_proficiencies set name_en = 'Artistic Ability' where name = 'Künstlerisches Talent';
update public.nonweapon_proficiencies set name_en = 'Blacksmithing' where name = 'Schmieden';
update public.nonweapon_proficiencies set name_en = 'Brewing' where name = 'Brauen';
update public.nonweapon_proficiencies set name_en = 'Carpentry' where name = 'Zimmermannskunst';
update public.nonweapon_proficiencies set name_en = 'Cobbling' where name = 'Schuhmacherei';
update public.nonweapon_proficiencies set name_en = 'Cooking' where name = 'Kochen';
update public.nonweapon_proficiencies set name_en = 'Dancing' where name = 'Tanzen';
update public.nonweapon_proficiencies set name_en = 'Direction Sense' where name = 'Orientierungssinn';
update public.nonweapon_proficiencies set name_en = 'Etiquette' where name = 'Etikette';
update public.nonweapon_proficiencies set name_en = 'Fire-building' where name = 'Feuer machen';
update public.nonweapon_proficiencies set name_en = 'Fishing' where name = 'Fischen';
update public.nonweapon_proficiencies set name_en = 'Heraldry' where name = 'Heraldik';
update public.nonweapon_proficiencies set name_en = 'Languages, Modern' where name = 'Moderne Sprachen';
update public.nonweapon_proficiencies set name_en = 'Leatherworking' where name = 'Lederverarbeitung';
update public.nonweapon_proficiencies set name_en = 'Mining' where name = 'Bergbau';
update public.nonweapon_proficiencies set name_en = 'Navigation' where name = 'Navigation';
update public.nonweapon_proficiencies set name_en = 'Pottery' where name = 'Töpfern';
update public.nonweapon_proficiencies set name_en = 'Riding, Land-based' where name = 'Reiten (Land)';
update public.nonweapon_proficiencies set name_en = 'Rope Use' where name = 'Seilkunst';
update public.nonweapon_proficiencies set name_en = 'Seamstress/Tailor' where name = 'Schneiderei';
update public.nonweapon_proficiencies set name_en = 'Singing' where name = 'Singen';
update public.nonweapon_proficiencies set name_en = 'Swimming' where name = 'Schwimmen';
update public.nonweapon_proficiencies set name_en = 'Weather Sense' where name = 'Wettervorhersage';
update public.nonweapon_proficiencies set name_en = 'Weaving' where name = 'Weben';
-- Warrior
update public.nonweapon_proficiencies set name_en = 'Animal Lore' where name = 'Tierkunde';
update public.nonweapon_proficiencies set name_en = 'Armorer' where name = 'Rüstungsschmied';
update public.nonweapon_proficiencies set name_en = 'Blind-fighting' where name = 'Blindkampf';
update public.nonweapon_proficiencies set name_en = 'Bowyer/Fletcher' where name = 'Bogenbau';
update public.nonweapon_proficiencies set name_en = 'Endurance' where name = 'Ausdauer';
update public.nonweapon_proficiencies set name_en = 'Gaming' where name = 'Glücksspiel';
update public.nonweapon_proficiencies set name_en = 'Hunting' where name = 'Jagd';
update public.nonweapon_proficiencies set name_en = 'Mountaineering' where name = 'Bergsteigen';
update public.nonweapon_proficiencies set name_en = 'Running' where name = 'Laufen';
update public.nonweapon_proficiencies set name_en = 'Set Snares' where name = 'Fallen stellen';
update public.nonweapon_proficiencies set name_en = 'Survival' where name = 'Überleben';
update public.nonweapon_proficiencies set name_en = 'Tracking' where name = 'Fährtensuche';
-- Priest
update public.nonweapon_proficiencies set name_en = 'Ancient History' where name = 'Alte Geschichte';
update public.nonweapon_proficiencies set name_en = 'Astrology' where name = 'Astrologie';
update public.nonweapon_proficiencies set name_en = 'Engineering' where name = 'Ingenieurskunst';
update public.nonweapon_proficiencies set name_en = 'Healing' where name = 'Heilen';
update public.nonweapon_proficiencies set name_en = 'Herbalism' where name = 'Kräuterkunde';
update public.nonweapon_proficiencies set name_en = 'Languages, Ancient' where name = 'Alte Sprachen';
update public.nonweapon_proficiencies set name_en = 'Local History' where name = 'Lokale Geschichte';
update public.nonweapon_proficiencies set name_en = 'Musical Instrument' where name = 'Musikinstrument';
update public.nonweapon_proficiencies set name_en = 'Reading/Writing' where name = 'Lesen/Schreiben';
-- Rogue
update public.nonweapon_proficiencies set name_en = 'Ancient Languages' where id = 'ancient_languages';
update public.nonweapon_proficiencies set name_en = 'Appraising' where name = 'Schätzen';
update public.nonweapon_proficiencies set name_en = 'Disguise' where name = 'Verkleidung';
update public.nonweapon_proficiencies set name_en = 'Forgery' where name = 'Fälschung';
update public.nonweapon_proficiencies set name_en = 'Gem Cutting' where name = 'Edelsteinschleifen';
update public.nonweapon_proficiencies set name_en = 'Juggling' where name = 'Jonglieren';
update public.nonweapon_proficiencies set name_en = 'Jumping' where name = 'Springen';
update public.nonweapon_proficiencies set name_en = 'Locksmithing' where name = 'Schlosserei';
update public.nonweapon_proficiencies set name_en = 'Tumbling' where name = 'Akrobatik';
update public.nonweapon_proficiencies set name_en = 'Tightrope Walking' where name = 'Seiltanz';
update public.nonweapon_proficiencies set name_en = 'Ventriloquism' where name = 'Bauchreden';
update public.nonweapon_proficiencies set name_en = 'Reading Lips' where name = 'Lippenlesen';
-- Wizard
update public.nonweapon_proficiencies set name_en = 'Alchemy' where id = 'alchemy';
update public.nonweapon_proficiencies set name_en = 'Gem Cutting' where id = 'gem_cutting';
update public.nonweapon_proficiencies set name_en = 'Navigation' where id = 'navigation_wiz';
update public.nonweapon_proficiencies set name_en = 'Reading/Writing' where id = 'reading_writing_wiz';
update public.nonweapon_proficiencies set name_en = 'Religion' where name = 'Religion';
update public.nonweapon_proficiencies set name_en = 'Spellcraft' where name = 'Zauberkunde';
