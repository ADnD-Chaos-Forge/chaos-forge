-- ═══════════════════════════════════════════════════════════════════════════════
-- Spell English Names, Casting Times & Saving Throws
-- Official AD&D 2nd Edition PHB data for all 374 spells
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── WIZARD SPELLS ──────────────────────────────────────────────────────────

-- ── Wizard Level 1 ──────────────────────────────────────────────────────────

update public.spells set name_en = 'Alarm', casting_time = '1 round', saving_throw = 'None' where name = 'Alarm';
update public.spells set name_en = 'Burning Hands', casting_time = '1', saving_throw = '½' where name = 'Brennende Hände';
update public.spells set name_en = 'Charm Person', casting_time = '1', saving_throw = 'Neg.' where name = 'Person Bezaubern';
update public.spells set name_en = 'Color Spray', casting_time = '1', saving_throw = 'Special' where name = 'Farbspray';
update public.spells set name_en = 'Comprehend Languages', casting_time = '1 round', saving_throw = 'None' where name = 'Sprachen Verstehen';
update public.spells set name_en = 'Detect Magic', casting_time = '1', saving_throw = 'None' where name = 'Magie Entdecken';
update public.spells set name_en = 'Enlarge', casting_time = '1', saving_throw = 'Neg.' where name = 'Vergrößern';
update public.spells set name_en = 'Feather Fall', casting_time = '1', saving_throw = 'None' where name = 'Federfall';
update public.spells set name_en = 'Find Familiar', casting_time = '2d12 hours', saving_throw = 'Special' where name = 'Vertrauten Finden';
update public.spells set name_en = 'Friends', casting_time = '1', saving_throw = 'Special' where name = 'Freunde';
update public.spells set name_en = 'Grease', casting_time = '1', saving_throw = 'Special' where name = 'Schmieren';
update public.spells set name_en = 'Hold Portal', casting_time = '1', saving_throw = 'None' where name = 'Portal Verschließen';
update public.spells set name_en = 'Light', casting_time = '1', saving_throw = 'Special' where name = 'Licht (Magier)';
update public.spells set name_en = 'Mending', casting_time = '1', saving_throw = 'None' where name = 'Ausbessern';
update public.spells set name_en = 'Message', casting_time = '1', saving_throw = 'None' where name = 'Nachricht';
update public.spells set name_en = 'Mount', casting_time = '1 turn', saving_throw = 'None' where name = 'Reittier';
update public.spells set name_en = 'Phantasmal Force', casting_time = '1', saving_throw = 'Special' where name = 'Phantasiegebilde';
update public.spells set name_en = 'Protection from Evil', casting_time = '1', saving_throw = 'None' where name = 'Schutz vor Bösem (Magier)';
update public.spells set name_en = 'Read Magic', casting_time = '1 round', saving_throw = 'None' where name = 'Magie Lesen';
update public.spells set name_en = 'Spider Climb', casting_time = '1', saving_throw = 'Neg.' where name = 'Spinnenklettern';
update public.spells set name_en = 'Tenser''s Floating Disc', casting_time = '1', saving_throw = 'None' where name = 'Tensers Schwebende Scheibe';
update public.spells set name_en = 'Unseen Servant', casting_time = '1', saving_throw = 'None' where name = 'Unsichtbarer Diener';
update public.spells set name_en = 'Wall of Fog', casting_time = '1', saving_throw = 'None' where name = 'Nebelwand';
update public.spells set name_en = 'Wizard Mark', casting_time = '1', saving_throw = 'None' where name = 'Magierzeichen';

-- ── Wizard Level 2 ──────────────────────────────────────────────────────────

update public.spells set name_en = 'Alter Self', casting_time = '2', saving_throw = 'None' where name = 'Selbst Verändern';
update public.spells set name_en = 'Blindness', casting_time = '2', saving_throw = 'Neg.' where name = 'Blindheit';
update public.spells set name_en = 'Blur', casting_time = '2', saving_throw = 'None' where name = 'Verschwimmen';
update public.spells set name_en = 'Continual Light', casting_time = '2', saving_throw = 'Special' where name = 'Dauerlicht';
update public.spells set name_en = 'Darkness, 15'' Radius', casting_time = '2', saving_throw = 'None' where name = 'Dunkelheit 15 Fuß Radius';
update public.spells set name_en = 'Deafness', casting_time = '2', saving_throw = 'Neg.' where name = 'Taubheit';
update public.spells set name_en = 'Detect Evil', casting_time = '2', saving_throw = 'None' where name = 'Böses Entdecken';
update public.spells set name_en = 'ESP', casting_time = '2', saving_throw = 'None' where name = 'ESP';
update public.spells set name_en = 'Flaming Sphere', casting_time = '2', saving_throw = 'Neg.' where name = 'Flammenkugel';
update public.spells set name_en = 'Fog Cloud', casting_time = '2', saving_throw = 'None' where name = 'Nebelwolke';
update public.spells set name_en = 'Glitterdust', casting_time = '2', saving_throw = 'Special' where name = 'Glitzerstaub';
update public.spells set name_en = 'Levitate', casting_time = '2', saving_throw = 'Neg.' where name = 'Levitation';
update public.spells set name_en = 'Magic Mouth', casting_time = '2', saving_throw = 'None' where name = 'Magischer Mund';
update public.spells set name_en = 'Melf''s Acid Arrow', casting_time = '2', saving_throw = 'Special' where name = 'Melfs Säurepfeil';
update public.spells set name_en = 'Mirror Image', casting_time = '2', saving_throw = 'None' where name = 'Spiegelbild';
update public.spells set name_en = 'Misdirection', casting_time = '2', saving_throw = 'Neg.' where name = 'Irreführung';
update public.spells set name_en = 'Pyrotechnics', casting_time = '2', saving_throw = 'None' where name = 'Pyrotechnik';
update public.spells set name_en = 'Ray of Enfeeblement', casting_time = '2', saving_throw = 'Neg.' where name = 'Schwächestrahl';
update public.spells set name_en = 'Rope Trick', casting_time = '2', saving_throw = 'None' where name = 'Seiltrick';
update public.spells set name_en = 'Shatter', casting_time = '2', saving_throw = 'Neg.' where name = 'Zertrümmern';
update public.spells set name_en = 'Stinking Cloud', casting_time = '2', saving_throw = 'Special' where name = 'Stinkende Wolke';
update public.spells set name_en = 'Web', casting_time = '2', saving_throw = 'Neg.' where name = 'Netz';
update public.spells set name_en = 'Wizard Lock', casting_time = '2', saving_throw = 'None' where name = 'Magierschloss';

-- ── Wizard Level 3 ──────────────────────────────────────────────────────────

update public.spells set name_en = 'Blink', casting_time = '1', saving_throw = 'None' where name = 'Blinzeln';
update public.spells set name_en = 'Clairvoyance', casting_time = '3', saving_throw = 'None' where name = 'Hellsehen';
update public.spells set name_en = 'Dispel Magic', casting_time = '3', saving_throw = 'None' where name = 'Magie Bannen';
update public.spells set name_en = 'Explosive Runes', casting_time = '3', saving_throw = 'None' where name = 'Explosive Runen';
update public.spells set name_en = 'Flame Arrow', casting_time = '3', saving_throw = 'None' where name = 'Flammenpfeil';
update public.spells set name_en = 'Fly', casting_time = '3', saving_throw = 'None' where name = 'Fliegen';
update public.spells set name_en = 'Gust of Wind', casting_time = '3', saving_throw = 'None' where name = 'Windstoß';
update public.spells set name_en = 'Haste', casting_time = '3', saving_throw = 'None' where name = 'Hast';
update public.spells set name_en = 'Hold Person', casting_time = '3', saving_throw = 'Neg.' where name = 'Person Festhalten';
update public.spells set name_en = 'Infravision', casting_time = '1 round', saving_throw = 'None' where name = 'Infravision';
update public.spells set name_en = 'Invisibility, 10'' Radius', casting_time = '3', saving_throw = 'None' where name = 'Unsichtbarkeit 10 Fuß Radius';
update public.spells set name_en = 'Monster Summoning I', casting_time = '3', saving_throw = 'None' where name = 'Monsterbeschwörung I';
update public.spells set name_en = 'Non-Detection', casting_time = '3', saving_throw = 'None' where name = 'Nichterkennung';
update public.spells set name_en = 'Phantom Steed', casting_time = '1 turn', saving_throw = 'None' where name = 'Phantomross';
update public.spells set name_en = 'Protection from Evil, 10'' Radius', casting_time = '3', saving_throw = 'None' where name = 'Schutz vor Bösem 10 Fuß Radius';
update public.spells set name_en = 'Protection from Normal Missiles', casting_time = '3', saving_throw = 'None' where name = 'Schutz vor normalen Geschossen';
update public.spells set name_en = 'Slow', casting_time = '3', saving_throw = 'Neg.' where name = 'Verlangsamen';
update public.spells set name_en = 'Suggestion', casting_time = '3', saving_throw = 'Neg.' where name = 'Suggestion';
update public.spells set name_en = 'Tongues', casting_time = '3', saving_throw = 'None' where name = 'Sprachen';
update public.spells set name_en = 'Vampiric Touch', casting_time = '3', saving_throw = 'None' where name = 'Vampirberührung';
update public.spells set name_en = 'Water Breathing', casting_time = '3', saving_throw = 'None' where name = 'Wasseratmung';
update public.spells set name_en = 'Wind Wall', casting_time = '3', saving_throw = 'Special' where name = 'Windmauer';

-- ── Wizard Level 4 ──────────────────────────────────────────────────────────

update public.spells set name_en = 'Charm Monster', casting_time = '4', saving_throw = 'Neg.' where name = 'Monster Bezaubern';
update public.spells set name_en = 'Confusion', casting_time = '4', saving_throw = 'Special' where name = 'Verwirrung';
update public.spells set name_en = 'Contagion', casting_time = '4', saving_throw = 'Neg.' where name = 'Ansteckung';
update public.spells set name_en = 'Detect Scrying', casting_time = '3', saving_throw = 'None' where name = 'Beobachtung Erkennen';
update public.spells set name_en = 'Dimension Door', casting_time = '1', saving_throw = 'None' where name = 'Dimensionstür';
update public.spells set name_en = 'Emotion', casting_time = '4', saving_throw = 'Neg.' where name = 'Emotion';
update public.spells set name_en = 'Enchanted Weapon', casting_time = '1 turn', saving_throw = 'None' where name = 'Verzauberte Waffe';
update public.spells set name_en = 'Evard''s Black Tentacles', casting_time = '1 round', saving_throw = 'None' where name = 'Evards Schwarze Tentakel';
update public.spells set name_en = 'Fear', casting_time = '4', saving_throw = 'Neg.' where name = 'Furcht';
update public.spells set name_en = 'Fire Shield', casting_time = '4', saving_throw = 'None' where name = 'Feuerschild';
update public.spells set name_en = 'Fire Trap', casting_time = '1 turn', saving_throw = '½' where name = 'Feuerfalle';
update public.spells set name_en = 'Fumble', casting_time = '4', saving_throw = 'Special' where name = 'Tollpatschigkeit';
update public.spells set name_en = 'Minor Globe of Invulnerability', casting_time = '4', saving_throw = 'None' where name = 'Kleine Globus der Unverwundbarkeit';
update public.spells set name_en = 'Hallucinatory Terrain', casting_time = '1 turn', saving_throw = 'None' where name = 'Halluzinatorisches Gelände';
update public.spells set name_en = 'Ice Storm', casting_time = '4', saving_throw = 'None' where name = 'Eissturm';
update public.spells set name_en = 'Illusionary Wall', casting_time = '4', saving_throw = 'None' where name = 'Illusorische Wand';
update public.spells set name_en = 'Massmorph', casting_time = '1 turn', saving_throw = 'None' where name = 'Massmorph';
update public.spells set name_en = 'Monster Summoning II', casting_time = '4', saving_throw = 'None' where name = 'Monsterbeschwörung II';
update public.spells set name_en = 'Otiluke''s Resilient Sphere', casting_time = '4', saving_throw = 'Neg.' where name = 'Otilukes Widerstandsfähige Kugel';
update public.spells set name_en = 'Phantasmal Killer', casting_time = '4', saving_throw = 'Special' where name = 'Phantastischer Killer';
update public.spells set name_en = 'Plant Growth', casting_time = '4', saving_throw = 'None' where name = 'Pflanzenwachstum';
update public.spells set name_en = 'Polymorph Other', casting_time = '4', saving_throw = 'Neg.' where name = 'Andere Verwandeln';
update public.spells set name_en = 'Polymorph Self', casting_time = '4', saving_throw = 'None' where name = 'Selbst Verwandeln';
update public.spells set name_en = 'Remove Curse', casting_time = '4', saving_throw = 'Special' where name = 'Fluch Brechen (Magier)';
update public.spells set name_en = 'Solid Fog', casting_time = '4', saving_throw = 'None' where name = 'Dichter Nebel';
update public.spells set name_en = 'Stoneskin', casting_time = '1', saving_throw = 'None' where name = 'Steinhaut';
update public.spells set name_en = 'Wall of Fire', casting_time = '4', saving_throw = 'None' where name = 'Feuerwand';
update public.spells set name_en = 'Wall of Ice', casting_time = '4', saving_throw = 'None' where name = 'Eiswand';
update public.spells set name_en = 'Wizard Eye', casting_time = '1 turn', saving_throw = 'None' where name = 'Magierauge';

-- ── Wizard Level 5 ──────────────────────────────────────────────────────────

update public.spells set name_en = 'Animate Dead', casting_time = '5 rounds', saving_throw = 'None' where name = 'Untote Beleben';
update public.spells set name_en = 'Avoidance', casting_time = '5', saving_throw = 'Special' where name = 'Abwendung';
update public.spells set name_en = 'Bigby''s Interposing Hand', casting_time = '5', saving_throw = 'None' where name = 'Bigbys Blockierende Hand';
update public.spells set name_en = 'Chaos', casting_time = '5', saving_throw = 'Special' where name = 'Chaos';
update public.spells set name_en = 'Cloudkill', casting_time = '5', saving_throw = 'None' where name = 'Todeswolke';
update public.spells set name_en = 'Cone of Cold', casting_time = '5', saving_throw = '½' where name = 'Kältekegel';
update public.spells set name_en = 'Conjure Elemental', casting_time = '1 turn', saving_throw = 'None' where name = 'Elementar Beschwören';
update public.spells set name_en = 'Contact Other Plane', casting_time = '1 turn', saving_throw = 'None' where name = 'Andere Ebene Kontaktieren';
update public.spells set name_en = 'Demi-Shadow Monsters', casting_time = '5', saving_throw = 'Special' where name = 'Halbschattenmonster';
update public.spells set name_en = 'Dismissal', casting_time = '1 round', saving_throw = 'Neg.' where name = 'Verbannung (Magier)';
update public.spells set name_en = 'Domination', casting_time = '5', saving_throw = 'Neg.' where name = 'Beherrschung';
update public.spells set name_en = 'Dream', casting_time = '1 turn', saving_throw = 'None' where name = 'Traum';
update public.spells set name_en = 'Extension II', casting_time = '5', saving_throw = 'None' where name = 'Erweiterung II';
update public.spells set name_en = 'Fabricate', casting_time = 'Special', saving_throw = 'None' where name = 'Herstellung';
update public.spells set name_en = 'Feeblemind', casting_time = '5', saving_throw = 'Neg.' where name = 'Schwachsinn';
update public.spells set name_en = 'Hold Monster', casting_time = '5', saving_throw = 'Neg.' where name = 'Monster Festhalten';
update public.spells set name_en = 'Leomund''s Secret Chest', casting_time = '1 turn', saving_throw = 'None' where name = 'Leomunds Geheime Truhe';
update public.spells set name_en = 'Magic Jar', casting_time = '1 round', saving_throw = 'Special' where name = 'Magisches Gefäß';
update public.spells set name_en = 'Monster Summoning III', casting_time = '5', saving_throw = 'None' where name = 'Monsterbeschwörung III';
update public.spells set name_en = 'Mordenkainen''s Faithful Hound', casting_time = '5', saving_throw = 'None' where name = 'Mordenkainens Treuer Hund';
update public.spells set name_en = 'Passwall', casting_time = '5', saving_throw = 'None' where name = 'Durchgang';
update public.spells set name_en = 'Seeming', casting_time = '5', saving_throw = 'None' where name = 'Scheingestalt';
update public.spells set name_en = 'Shadow Door', casting_time = '2', saving_throw = 'None' where name = 'Schattentür';
update public.spells set name_en = 'Shadow Magic', casting_time = '5', saving_throw = 'Special' where name = 'Schattenmagie';
update public.spells set name_en = 'Stone Shape', casting_time = '1 round', saving_throw = 'None' where name = 'Stein Formen';
update public.spells set name_en = 'Telekinesis', casting_time = '5', saving_throw = 'Neg.' where name = 'Telekinese';
update public.spells set name_en = 'Teleport', casting_time = '2', saving_throw = 'None' where name = 'Teleportieren';
update public.spells set name_en = 'Transmute Rock to Mud', casting_time = '5', saving_throw = 'None' where name = 'Fels zu Schlamm';
update public.spells set name_en = 'Wall of Force', casting_time = '5', saving_throw = 'None' where name = 'Kraftwand';
update public.spells set name_en = 'Wall of Iron', casting_time = '5', saving_throw = 'None' where name = 'Eisenwand';
update public.spells set name_en = 'Wall of Stone', casting_time = '5', saving_throw = 'None' where name = 'Steinwand';

-- ── Wizard Level 6 ──────────────────────────────────────────────────────────

update public.spells set name_en = 'Anti-Magic Shell', casting_time = '1', saving_throw = 'None' where name = 'Antimagische Hülle';
update public.spells set name_en = 'Chain Lightning', casting_time = '5', saving_throw = '½' where name = 'Kettenblitz';
update public.spells set name_en = 'Contingency', casting_time = '1 turn', saving_throw = 'None' where name = 'Kontingenz';
update public.spells set name_en = 'Control Weather', casting_time = '1 turn', saving_throw = 'None' where name = 'Wetter Kontrollieren (Magier)';
update public.spells set name_en = 'Death Spell', casting_time = '6', saving_throw = 'None' where name = 'Todesfinger (Magier)';
update public.spells set name_en = 'Disintegrate', casting_time = '6', saving_throw = 'Neg.' where name = 'Auflösung';
update public.spells set name_en = 'Enchant an Item', casting_time = 'Special', saving_throw = 'Neg.' where name = 'Gegenstand Verzaubern';
update public.spells set name_en = 'Eyebite', casting_time = '6', saving_throw = 'Special' where name = 'Böser Blick';
update public.spells set name_en = 'Geas', casting_time = '4', saving_throw = 'None' where name = 'Geas';
update public.spells set name_en = 'Globe of Invulnerability', casting_time = '1 round', saving_throw = 'None' where name = 'Globus der Unverwundbarkeit';
update public.spells set name_en = 'Guards and Wards', casting_time = '3 turns', saving_throw = 'None' where name = 'Schutzzauber';
update public.spells set name_en = 'Invisible Stalker', casting_time = '1 round', saving_throw = 'None' where name = 'Unsichtbarer Verfolger';
update public.spells set name_en = 'Legend Lore', casting_time = 'Special', saving_throw = 'None' where name = 'Legendenkunde';
update public.spells set name_en = 'Mass Suggestion', casting_time = '6', saving_throw = 'Neg.' where name = 'Massensuggestion';
update public.spells set name_en = 'Mislead', casting_time = '6', saving_throw = 'None' where name = 'Trugbild';
update public.spells set name_en = 'Monster Summoning IV', casting_time = '6', saving_throw = 'None' where name = 'Monsterbeschwörung IV';
update public.spells set name_en = 'Move Earth', casting_time = 'Special', saving_throw = 'None' where name = 'Erde Bewegen';
update public.spells set name_en = 'Otiluke''s Freezing Sphere', casting_time = '6', saving_throw = 'Special' where name = 'Otilukes Gefrierkugel';
update public.spells set name_en = 'Permanent Illusion', casting_time = '6', saving_throw = 'Special' where name = 'Permanente Illusion';
update public.spells set name_en = 'Programmed Illusion', casting_time = '6', saving_throw = 'Special' where name = 'Programmierte Illusion';
update public.spells set name_en = 'Project Image', casting_time = '6', saving_throw = 'None' where name = 'Projektbild';
update public.spells set name_en = 'Repulsion', casting_time = '6', saving_throw = 'None' where name = 'Abstoßung';
update public.spells set name_en = 'Stone to Flesh', casting_time = '6', saving_throw = 'Special' where name = 'Stein zu Fleisch';
update public.spells set name_en = 'Tenser''s Transformation', casting_time = '6', saving_throw = 'None' where name = 'Tensers Transformation';
update public.spells set name_en = 'True Seeing', casting_time = '1 round', saving_throw = 'None' where name = 'Wahres Sehen (Magier)';
update public.spells set name_en = 'Veil', casting_time = '6', saving_throw = 'None' where name = 'Schleier';

-- ── Wizard Level 7 ──────────────────────────────────────────────────────────

update public.spells set name_en = 'Banishment', casting_time = '7', saving_throw = 'Neg.' where name = 'Verbannung';
update public.spells set name_en = 'Control Undead', casting_time = '7', saving_throw = 'Special' where name = 'Untote Kontrollieren';
update public.spells set name_en = 'Delayed Blast Fireball', casting_time = '7', saving_throw = '½' where name = 'Verzögerter Feuerball';
update public.spells set name_en = 'Drawmij''s Instant Summons', casting_time = '1', saving_throw = 'None' where name = 'Drawmijs Sofortige Beschwörung';
update public.spells set name_en = 'Duo-Dimension', casting_time = '7', saving_throw = 'None' where name = 'Duo-Dimension';
update public.spells set name_en = 'Finger of Death', casting_time = '5', saving_throw = 'Neg.' where name = 'Todesfinger';
update public.spells set name_en = 'Forcecage', casting_time = 'Special', saving_throw = 'None' where name = 'Kraftkäfig';
update public.spells set name_en = 'Limited Wish', casting_time = 'Special', saving_throw = 'Special' where name = 'Begrenzter Wunsch';
update public.spells set name_en = 'Mass Invisibility', casting_time = '7', saving_throw = 'None' where name = 'Massenunsuchtbarkeit';
update public.spells set name_en = 'Monster Summoning V', casting_time = '7', saving_throw = 'None' where name = 'Monsterbeschwörung V';
update public.spells set name_en = 'Mordenkainen''s Magnificent Mansion', casting_time = '7 rounds', saving_throw = 'None' where name = 'Mordenkainens Prächtige Villa';
update public.spells set name_en = 'Mordenkainen''s Sword', casting_time = '7', saving_throw = 'None' where name = 'Mordenkainens Schwert';
update public.spells set name_en = 'Phase Door', casting_time = '7', saving_throw = 'None' where name = 'Phasentür';
update public.spells set name_en = 'Power Word, Stun', casting_time = '1', saving_throw = 'None' where name = 'Machtwort: Betäubung';
update public.spells set name_en = 'Prismatic Spray', casting_time = '7', saving_throw = 'Special' where name = 'Prismatischer Spray';
update public.spells set name_en = 'Reverse Gravity', casting_time = '7', saving_throw = 'None' where name = 'Schwerkraft Umkehren';
update public.spells set name_en = 'Sequester', casting_time = '1 round', saving_throw = 'Special' where name = 'Sequestrierung';
update public.spells set name_en = 'Simulacrum', casting_time = 'Special', saving_throw = 'None' where name = 'Trugbild (Simulakrum)';
update public.spells set name_en = 'Spell Turning', casting_time = '7', saving_throw = 'None' where name = 'Zauberreflexion';
update public.spells set name_en = 'Statue', casting_time = '7', saving_throw = 'Special' where name = 'Statue';
update public.spells set name_en = 'Teleport Without Error', casting_time = '1', saving_throw = 'None' where name = 'Teleportieren ohne Fehler';
update public.spells set name_en = 'Vanish', casting_time = '2', saving_throw = 'None' where name = 'Verschwinden';

-- ── Wizard Level 8 ──────────────────────────────────────────────────────────

update public.spells set name_en = 'Antipathy-Sympathy', casting_time = '1 hour', saving_throw = 'Special' where name = 'Antipathie-Sympathie';
update public.spells set name_en = 'Bigby''s Clenched Fist', casting_time = '8', saving_throw = 'None' where name = 'Bigbys Geballte Faust';
update public.spells set name_en = 'Binding', casting_time = 'Special', saving_throw = 'Special' where name = 'Bindung';
update public.spells set name_en = 'Clone', casting_time = '1 turn', saving_throw = 'None' where name = 'Klon';
update public.spells set name_en = 'Demand', casting_time = '1 turn', saving_throw = 'Special' where name = 'Forderung';
update public.spells set name_en = 'Glassteel', casting_time = '8', saving_throw = 'None' where name = 'Glasstahl';
update public.spells set name_en = 'Incendiary Cloud', casting_time = '2 rounds', saving_throw = '½' where name = 'Brandwolke';
update public.spells set name_en = 'Mass Charm', casting_time = '8', saving_throw = 'Neg.' where name = 'Massenbezauberung';
update public.spells set name_en = 'Maze', casting_time = '3', saving_throw = 'None' where name = 'Irrgarten';
update public.spells set name_en = 'Mind Blank', casting_time = '1', saving_throw = 'None' where name = 'Gedankenleere';
update public.spells set name_en = 'Monster Summoning VI', casting_time = '8', saving_throw = 'None' where name = 'Monsterbeschwörung VI';
update public.spells set name_en = 'Otiluke''s Telekinetic Sphere', casting_time = '4', saving_throw = 'Neg.' where name = 'Otilukes Telekinesekugel';
update public.spells set name_en = 'Otto''s Irresistible Dance', casting_time = '5', saving_throw = 'None' where name = 'Ottos Unwiderstehlicher Tanz';
update public.spells set name_en = 'Permanency', casting_time = '2 rounds', saving_throw = 'None' where name = 'Permanenz';
update public.spells set name_en = 'Polymorph Any Object', casting_time = '8', saving_throw = 'Special' where name = 'Beliebig Verwandeln';
update public.spells set name_en = 'Power Word, Blind', casting_time = '1', saving_throw = 'None' where name = 'Machtwort: Blindheit';
update public.spells set name_en = 'Prismatic Wall', casting_time = '7', saving_throw = 'Special' where name = 'Prismatische Wand';
update public.spells set name_en = 'Screen', casting_time = '1 hour', saving_throw = 'None' where name = 'Abschirmung';
update public.spells set name_en = 'Serten''s Spell Immunity', casting_time = '1 round', saving_throw = 'None' where name = 'Sertens Zauberimmunität';
update public.spells set name_en = 'Sink', casting_time = '8', saving_throw = 'Special' where name = 'Versinken';
update public.spells set name_en = 'Symbol', casting_time = '8', saving_throw = 'Special' where name = 'Symbol (Magier)';
update public.spells set name_en = 'Trap the Soul', casting_time = 'Special', saving_throw = 'Neg.' where name = 'Seele Fangen';

-- ── Wizard Level 9 ──────────────────────────────────────────────────────────

update public.spells set name_en = 'Astral Spell', casting_time = '9', saving_throw = 'None' where name = 'Astralzauber (Magier)';
update public.spells set name_en = 'Bigby''s Crushing Hand', casting_time = '9', saving_throw = 'None' where name = 'Bigbys Zerquetschende Hand';
update public.spells set name_en = 'Crystalbrittle', casting_time = '9', saving_throw = 'Special' where name = 'Kristallbrüchigkeit';
update public.spells set name_en = 'Energy Drain', casting_time = '3', saving_throw = 'None' where name = 'Energieentzug';
update public.spells set name_en = 'Foresight', casting_time = '1 round', saving_throw = 'None' where name = 'Voraussicht';
update public.spells set name_en = 'Gate', casting_time = '9', saving_throw = 'None' where name = 'Tor (Magier)';
update public.spells set name_en = 'Imprisonment', casting_time = '9', saving_throw = 'None' where name = 'Gefangenschaft';
update public.spells set name_en = 'Meteor Swarm', casting_time = '9', saving_throw = 'None' where name = 'Meteorschwarm';
update public.spells set name_en = 'Monster Summoning VII', casting_time = '9', saving_throw = 'None' where name = 'Monsterbeschwörung VII';
update public.spells set name_en = 'Mordenkainen''s Disjunction', casting_time = '9', saving_throw = 'Special' where name = 'Mordenkainens Disjunktion';
update public.spells set name_en = 'Power Word, Kill', casting_time = '1', saving_throw = 'None' where name = 'Machtwort: Tod';
update public.spells set name_en = 'Prismatic Sphere', casting_time = '7', saving_throw = 'Special' where name = 'Prismatische Kugel';
update public.spells set name_en = 'Shape Change', casting_time = '9', saving_throw = 'None' where name = 'Gestaltwandel';
update public.spells set name_en = 'Succor', casting_time = '1 day', saving_throw = 'None' where name = 'Beistand (Magier)';
update public.spells set name_en = 'Time Stop', casting_time = '9', saving_throw = 'None' where name = 'Zeitstillstand';
update public.spells set name_en = 'Temporal Stasis', casting_time = '9', saving_throw = 'None' where name = 'Zeitstasis';
update public.spells set name_en = 'Weird', casting_time = '9', saving_throw = 'Special' where name = 'Bizarr';
update public.spells set name_en = 'Wish', casting_time = 'Special', saving_throw = 'Special' where name = 'Wunsch';

-- ─── PRIEST SPELLS ──────────────────────────────────────────────────────────

-- ── Priest Level 1 ──────────────────────────────────────────────────────────

update public.spells set name_en = 'Animal Friendship', casting_time = '1 hour', saving_throw = 'Neg.' where name = 'Tierfreundschaft';
update public.spells set name_en = 'Combine', casting_time = '1 round', saving_throw = 'None' where name = 'Zusammenwirken';
update public.spells set name_en = 'Command', casting_time = '1', saving_throw = 'Special' where name = 'Befehl';
update public.spells set name_en = 'Create Water', casting_time = '1 round', saving_throw = 'None' where name = 'Wasser Erschaffen';
update public.spells set name_en = 'Detect Evil', casting_time = '1 round', saving_throw = 'None' where name = 'Böses Entdecken (Priester)';
update public.spells set name_en = 'Detect Magic', casting_time = '1 round', saving_throw = 'None' where name = 'Magie Entdecken (Priester)';
update public.spells set name_en = 'Detect Poison', casting_time = '4', saving_throw = 'None' where name = 'Gift Entdecken';
update public.spells set name_en = 'Detect Snares and Pits', casting_time = '4', saving_throw = 'None' where name = 'Schlingen und Gruben Entdecken';
update public.spells set name_en = 'Endure Cold/Endure Heat', casting_time = '1 round', saving_throw = 'None' where name = 'Hitze/Kälte Ertragen';
update public.spells set name_en = 'Entangle', casting_time = '4', saving_throw = '½' where name = 'Verschlingen';
update public.spells set name_en = 'Faerie Fire', casting_time = '4', saving_throw = 'None' where name = 'Feenfeuer';
update public.spells set name_en = 'Invisibility to Animals', casting_time = '4', saving_throw = 'None' where name = 'Unsichtbarkeit für Tiere';
update public.spells set name_en = 'Locate Animals or Plants', casting_time = '1 round', saving_throw = 'None' where name = 'Tiere oder Pflanzen Orten';
update public.spells set name_en = 'Magical Stone', casting_time = '4', saving_throw = 'None' where name = 'Magischer Stein';
update public.spells set name_en = 'Pass without Trace', casting_time = '1 round', saving_throw = 'None' where name = 'Spurloses Gehen';
update public.spells set name_en = 'Purify Food & Drink', casting_time = '1 round', saving_throw = 'None' where name = 'Nahrung und Wasser Reinigen';
update public.spells set name_en = 'Remove Fear', casting_time = '1', saving_throw = 'Special' where name = 'Angst Vertreiben';
update public.spells set name_en = 'Sanctuary', casting_time = '4', saving_throw = 'None' where name = 'Zuflucht';
update public.spells set name_en = 'Shillelagh', casting_time = '2', saving_throw = 'None' where name = 'Knüppelkeule';

-- ── Priest Level 2 ──────────────────────────────────────────────────────────

update public.spells set name_en = 'Aid', casting_time = '5', saving_throw = 'None' where name = 'Beistand';
update public.spells set name_en = 'Augury', casting_time = '2 rounds', saving_throw = 'None' where name = 'Weissagung';
update public.spells set name_en = 'Barkskin', casting_time = '5', saving_throw = 'None' where name = 'Baumrinde';
update public.spells set name_en = 'Chant', casting_time = '1 turn', saving_throw = 'None' where name = 'Gesang';
update public.spells set name_en = 'Charm Person or Mammal', casting_time = '5', saving_throw = 'Neg.' where name = 'Person oder Säuger Bezaubern';
update public.spells set name_en = 'Detect Charm', casting_time = '1 round', saving_throw = 'None' where name = 'Verzauberung Erkennen';
update public.spells set name_en = 'Dust Devil', casting_time = '2 rounds', saving_throw = 'None' where name = 'Staubteufel';
update public.spells set name_en = 'Enthrall', casting_time = '1 round', saving_throw = 'Neg.' where name = 'Fesseln';
update public.spells set name_en = 'Find Traps', casting_time = '5', saving_throw = 'None' where name = 'Fallen Finden';
update public.spells set name_en = 'Fire Trap', casting_time = '1 turn', saving_throw = '½' where name = 'Feuerfalle (Priester)';
update public.spells set name_en = 'Flame Blade', casting_time = '4', saving_throw = 'None' where name = 'Flammenklinge';
update public.spells set name_en = 'Goodberry', casting_time = '1 round', saving_throw = 'None' where name = 'Gutbeeren';
update public.spells set name_en = 'Heat Metal', casting_time = '5', saving_throw = 'Special' where name = 'Metall Erhitzen';
update public.spells set name_en = 'Hold Person', casting_time = '5', saving_throw = 'Neg.' where name = 'Person Festhalten (Priester)';
update public.spells set name_en = 'Know Alignment', casting_time = '1 round', saving_throw = 'Neg.' where name = 'Gesinnung Erkennen';
update public.spells set name_en = 'Messenger', casting_time = '1 round', saving_throw = 'None' where name = 'Bote';
update public.spells set name_en = 'Resist Fire/Resist Cold', casting_time = '5', saving_throw = 'None' where name = 'Feuer-/Kälteresistenz';
update public.spells set name_en = 'Slow Poison', casting_time = '1', saving_throw = 'None' where name = 'Gift Verlangsamen';
update public.spells set name_en = 'Snake Charm', casting_time = '5', saving_throw = 'None' where name = 'Schlange Bezaubern';
update public.spells set name_en = 'Speak with Animals', casting_time = '5', saving_throw = 'None' where name = 'Mit Tieren Sprechen';
update public.spells set name_en = 'Spiritual Hammer', casting_time = '5', saving_throw = 'None' where name = 'Geisthammer';
update public.spells set name_en = 'Trip', casting_time = '5', saving_throw = 'Neg.' where name = 'Stolperfalle';
update public.spells set name_en = 'Warp Wood', casting_time = '5', saving_throw = 'Special' where name = 'Holz Verziehen';
update public.spells set name_en = 'Withdraw', casting_time = '5', saving_throw = 'None' where name = 'Rückzug';
update public.spells set name_en = 'Wyvern Watch', casting_time = '5', saving_throw = 'Neg.' where name = 'Lindwurmwache';

-- ── Priest Level 3 ──────────────────────────────────────────────────────────

update public.spells set name_en = 'Animate Dead', casting_time = '1 round', saving_throw = 'None' where name = 'Untote Beleben (Priester)';
update public.spells set name_en = 'Call Lightning', casting_time = '1 turn', saving_throw = '½' where name = 'Blitz Rufen';
update public.spells set name_en = 'Continual Light', casting_time = '6', saving_throw = 'None' where name = 'Dauerlicht (Priester)';
update public.spells set name_en = 'Create Food & Water', casting_time = '1 turn', saving_throw = 'None' where name = 'Nahrung und Wasser Erschaffen';
update public.spells set name_en = 'Cure Blindness or Deafness', casting_time = '1 round', saving_throw = 'Special' where name = 'Blindheit oder Taubheit Heilen';
update public.spells set name_en = 'Cure Disease', casting_time = '1 round', saving_throw = 'None' where name = 'Krankheit Heilen';
update public.spells set name_en = 'Dispel Magic', casting_time = '6', saving_throw = 'None' where name = 'Magie Bannen (Priester)';
update public.spells set name_en = 'Feign Death', casting_time = '1', saving_throw = 'None' where name = 'Scheintod';
update public.spells set name_en = 'Flame Walk', casting_time = '5', saving_throw = 'None' where name = 'Flammengang';
update public.spells set name_en = 'Glyph of Warding', casting_time = 'Special', saving_throw = 'Special' where name = 'Schutzglyphe';
update public.spells set name_en = 'Hold Animal', casting_time = '6', saving_throw = 'Neg.' where name = 'Tier Festhalten';
update public.spells set name_en = 'Locate Object', casting_time = '1 turn', saving_throw = 'None' where name = 'Objekt Orten';
update public.spells set name_en = 'Magical Vestment', casting_time = '1 round', saving_throw = 'None' where name = 'Magisches Gewand';
update public.spells set name_en = 'Meld into Stone', casting_time = '6', saving_throw = 'None' where name = 'In Stein Verschmelzen';
update public.spells set name_en = 'Negative Plane Protection', casting_time = '1 round', saving_throw = 'None' where name = 'Schutz vor negativer Ebene';
update public.spells set name_en = 'Plant Growth', casting_time = '1 round', saving_throw = 'None' where name = 'Pflanzenwachstum (Priester)';
update public.spells set name_en = 'Protection from Fire', casting_time = '6', saving_throw = 'None' where name = 'Feuerschutz';
update public.spells set name_en = 'Remove Paralysis', casting_time = '6', saving_throw = 'None' where name = 'Lähmung Aufheben';
update public.spells set name_en = 'Snare', casting_time = '3 rounds', saving_throw = 'None' where name = 'Falle';
update public.spells set name_en = 'Speak with Dead', casting_time = '1 turn', saving_throw = 'Special' where name = 'Mit Toten Sprechen';
update public.spells set name_en = 'Spike Growth', casting_time = '6', saving_throw = 'None' where name = 'Dornenwuchs';
update public.spells set name_en = 'Stone Shape', casting_time = '1 round', saving_throw = 'None' where name = 'Stein Formen (Priester)';
update public.spells set name_en = 'Summon Insects', casting_time = '1 round', saving_throw = 'None' where name = 'Insekten Beschwören';
update public.spells set name_en = 'Water Breathing', casting_time = '6', saving_throw = 'None' where name = 'Wasseratmung (Priester)';
update public.spells set name_en = 'Water Walk', casting_time = '6', saving_throw = 'None' where name = 'Wasserwandeln';

-- ── Priest Level 4 ──────────────────────────────────────────────────────────

update public.spells set name_en = 'Abjure', casting_time = '1 round', saving_throw = 'Special' where name = 'Abweisung';
update public.spells set name_en = 'Animal Summoning I', casting_time = '7', saving_throw = 'None' where name = 'Tierbeschwörung I';
update public.spells set name_en = 'Call Woodland Beings', casting_time = '2 turns', saving_throw = 'Neg.' where name = 'Waldwesen Rufen';
update public.spells set name_en = 'Cloak of Bravery', casting_time = '6', saving_throw = 'Neg.' where name = 'Mantel der Tapferkeit';
update public.spells set name_en = 'Control Temperature, 10'' Radius', casting_time = '7', saving_throw = 'None' where name = 'Temperatur Kontrollieren 10 Fuß Radius';
update public.spells set name_en = 'Cure Serious Wounds', casting_time = '7', saving_throw = 'None' where name = 'Schwere Wunden Heilen (Verbessert)';
update public.spells set name_en = 'Detect Lie', casting_time = '7', saving_throw = 'Neg.' where name = 'Lüge Erkennen';
update public.spells set name_en = 'Divination', casting_time = '1 turn', saving_throw = 'None' where name = 'Wahrsagung';
update public.spells set name_en = 'Free Action', casting_time = '7', saving_throw = 'None' where name = 'Freie Aktion';
update public.spells set name_en = 'Giant Insect', casting_time = '7', saving_throw = 'None' where name = 'Rieseninsekt';
update public.spells set name_en = 'Hallucinatory Forest', casting_time = '7', saving_throw = 'None' where name = 'Halluzinatorischer Wald';
update public.spells set name_en = 'Imbue with Spell Ability', casting_time = '1 turn', saving_throw = 'None' where name = 'Mit Zauberkraft Erfüllen';
update public.spells set name_en = 'Lower Water', casting_time = '1 turn', saving_throw = 'None' where name = 'Wasser Senken';
update public.spells set name_en = 'Neutralize Poison', casting_time = '7', saving_throw = 'None' where name = 'Gift Neutralisieren';
update public.spells set name_en = 'Produce Fire', casting_time = '7', saving_throw = 'None' where name = 'Feuer Erzeugen';
update public.spells set name_en = 'Protection from Evil, 10'' Radius', casting_time = '7', saving_throw = 'None' where name = 'Schutz vor Bösem 10 Fuß Radius (Priester)';
update public.spells set name_en = 'Protection from Lightning', casting_time = '7', saving_throw = 'None' where name = 'Blitzschutz';
update public.spells set name_en = 'Reflecting Pool', casting_time = '2 hours', saving_throw = 'None' where name = 'Spiegelbecken';
update public.spells set name_en = 'Repel Insects', casting_time = '1 round', saving_throw = 'None' where name = 'Insekten Abwehren';
update public.spells set name_en = 'Speak with Plants', casting_time = '1 turn', saving_throw = 'None' where name = 'Mit Pflanzen Sprechen';
update public.spells set name_en = 'Spell Immunity', casting_time = '1 round', saving_throw = 'None' where name = 'Zauberimmunität';
update public.spells set name_en = 'Sticks to Snakes', casting_time = '7', saving_throw = 'None' where name = 'Stöcke zu Schlangen';
update public.spells set name_en = 'Tongues', casting_time = '7', saving_throw = 'None' where name = 'Sprachen (Priester)';

-- ── Priest Level 5 ──────────────────────────────────────────────────────────

update public.spells set name_en = 'Air Walk', casting_time = '8', saving_throw = 'None' where name = 'Luftwandeln';
update public.spells set name_en = 'Animal Growth', casting_time = '8', saving_throw = 'None' where name = 'Tierwachstum';
update public.spells set name_en = 'Animal Summoning II', casting_time = '8', saving_throw = 'None' where name = 'Tierbeschwörung II';
update public.spells set name_en = 'Atonement', casting_time = '1 turn', saving_throw = 'None' where name = 'Buße';
update public.spells set name_en = 'Commune', casting_time = '1 turn', saving_throw = 'None' where name = 'Kommunion';
update public.spells set name_en = 'Commune with Nature', casting_time = '1 turn', saving_throw = 'None' where name = 'Kommunion mit der Natur';
update public.spells set name_en = 'Control Winds', casting_time = '8', saving_throw = 'None' where name = 'Winde Kontrollieren';
update public.spells set name_en = 'Cure Critical Wounds', casting_time = '8', saving_throw = 'None' where name = 'Kritische Wunden Heilen';
update public.spells set name_en = 'Dispel Evil', casting_time = '8', saving_throw = 'Special' where name = 'Böses Bannen';
update public.spells set name_en = 'Flame Strike', casting_time = '8', saving_throw = '½' where name = 'Flammenschlag';
update public.spells set name_en = 'Insect Plague', casting_time = '1 turn', saving_throw = 'None' where name = 'Insektenplage';
update public.spells set name_en = 'Magic Font', casting_time = '1 hour', saving_throw = 'None' where name = 'Magischer Quell';
update public.spells set name_en = 'Moonbeam', casting_time = '8', saving_throw = 'None' where name = 'Mondstrahl';
update public.spells set name_en = 'Pass Plant', casting_time = '8', saving_throw = 'None' where name = 'Pflanzenpassage';
update public.spells set name_en = 'Plane Shift', casting_time = '8', saving_throw = 'Neg.' where name = 'Ebenenreise';
update public.spells set name_en = 'Quest', casting_time = '8', saving_throw = 'None' where name = 'Quest';
update public.spells set name_en = 'Rainbow', casting_time = '7', saving_throw = 'Special' where name = 'Regenbogen';
update public.spells set name_en = 'Raise Dead', casting_time = '1 round', saving_throw = 'Special' where name = 'Tote Erwecken';
update public.spells set name_en = 'Spike Stones', casting_time = '6', saving_throw = 'None' where name = 'Stachelfelsen';
update public.spells set name_en = 'Transmute Rock to Mud', casting_time = '8', saving_throw = 'None' where name = 'Fels zu Schlamm (Priester)';
update public.spells set name_en = 'True Seeing', casting_time = '1 round', saving_throw = 'None' where name = 'Wahres Sehen (Priester)';
update public.spells set name_en = 'Wall of Fire', casting_time = '8', saving_throw = 'None' where name = 'Feuerwand (Priester)';

-- ── Priest Level 6 ──────────────────────────────────────────────────────────

update public.spells set name_en = 'Aerial Servant', casting_time = '9', saving_throw = 'None' where name = 'Luftdiener';
update public.spells set name_en = 'Animal Summoning III', casting_time = '9', saving_throw = 'None' where name = 'Tierbeschwörung III';
update public.spells set name_en = 'Animate Object', casting_time = '9', saving_throw = 'None' where name = 'Objekt Beleben';
update public.spells set name_en = 'Anti-Animal Shell', casting_time = '1 round', saving_throw = 'None' where name = 'Anti-Tier-Hülle';
update public.spells set name_en = 'Blade Barrier', casting_time = '9', saving_throw = 'Special' where name = 'Klingenbarriere';
update public.spells set name_en = 'Conjure Animals', casting_time = '9', saving_throw = 'None' where name = 'Tiere Herbeirufen';
update public.spells set name_en = 'Conjure Fire Elemental', casting_time = '6 turns', saving_throw = 'None' where name = 'Feuerelementar Beschwören';
update public.spells set name_en = 'Find the Path', casting_time = '3 rounds', saving_throw = 'None' where name = 'Weg Finden';
update public.spells set name_en = 'Fire Seeds', casting_time = '1 round', saving_throw = '½' where name = 'Feuersamen';
update public.spells set name_en = 'Forbiddance', casting_time = '6 rounds', saving_throw = 'Special' where name = 'Bann';
update public.spells set name_en = 'Heal', casting_time = '1 round', saving_throw = 'None' where name = 'Heilung';
update public.spells set name_en = 'Heroes'' Feast', casting_time = '1 turn', saving_throw = 'None' where name = 'Heldenmahl';
update public.spells set name_en = 'Liveoak', casting_time = '1 turn', saving_throw = 'None' where name = 'Lebenseiche';
update public.spells set name_en = 'Part Water', casting_time = '1 turn', saving_throw = 'None' where name = 'Wasser Teilen';
update public.spells set name_en = 'Speak with Monsters', casting_time = '9', saving_throw = 'None' where name = 'Mit Monstern Sprechen';
update public.spells set name_en = 'Stone Tell', casting_time = '1 turn', saving_throw = 'None' where name = 'Stein Erzählt';
update public.spells set name_en = 'Transport via Plants', casting_time = '4', saving_throw = 'None' where name = 'Pflanzenreise';
update public.spells set name_en = 'Turn Wood', casting_time = '9', saving_throw = 'None' where name = 'Holz Wenden';
update public.spells set name_en = 'Wall of Thorns', casting_time = '9', saving_throw = 'None' where name = 'Dornenwand';
update public.spells set name_en = 'Weather Summoning', casting_time = '1 turn', saving_throw = 'None' where name = 'Wetter Beschwören';
update public.spells set name_en = 'Word of Recall', casting_time = '1', saving_throw = 'None' where name = 'Worte der Rückkehr';

-- ── Priest Level 7 ──────────────────────────────────────────────────────────

update public.spells set name_en = 'Animate Rock', casting_time = '1 round', saving_throw = 'None' where name = 'Stein Beleben';
update public.spells set name_en = 'Astral Spell', casting_time = '1 turn', saving_throw = 'None' where name = 'Astralzauber (Priester)';
update public.spells set name_en = 'Changestaff', casting_time = '4', saving_throw = 'None' where name = 'Stabwandlung';
update public.spells set name_en = 'Chariot of Sustarre', casting_time = '1 turn', saving_throw = 'None' where name = 'Chariot von Sustarre';
update public.spells set name_en = 'Confusion', casting_time = '9', saving_throw = 'Special' where name = 'Verwirrung (Priester)';
update public.spells set name_en = 'Conjure Earth Elemental', casting_time = '1 turn', saving_throw = 'None' where name = 'Erdelementar Beschwören';
update public.spells set name_en = 'Control Weather', casting_time = '1 turn', saving_throw = 'None' where name = 'Wetter Kontrollieren (Priester)';
update public.spells set name_en = 'Creeping Doom', casting_time = '9', saving_throw = 'None' where name = 'Kriechender Tod';
update public.spells set name_en = 'Earthquake', casting_time = '1 turn', saving_throw = 'None' where name = 'Erdbeben';
update public.spells set name_en = 'Exaction', casting_time = '1 turn', saving_throw = 'None' where name = 'Forderung (Priester)';
update public.spells set name_en = 'Fire Storm', casting_time = '1 round', saving_throw = '½' where name = 'Feuersturm';
update public.spells set name_en = 'Gate', casting_time = '5', saving_throw = 'None' where name = 'Tor (Priester)';
update public.spells set name_en = 'Holy Word', casting_time = '1', saving_throw = 'None' where name = 'Heiliges Wort';
update public.spells set name_en = 'Regenerate', casting_time = '3 rounds', saving_throw = 'None' where name = 'Regeneration';
update public.spells set name_en = 'Reincarnate', casting_time = '1 turn', saving_throw = 'None' where name = 'Reinkarnation';
update public.spells set name_en = 'Restoration', casting_time = '3 rounds', saving_throw = 'None' where name = 'Wiederherstellung';
update public.spells set name_en = 'Resurrection', casting_time = '1 turn', saving_throw = 'None' where name = 'Auferstehung';
update public.spells set name_en = 'Succor', casting_time = '1 day', saving_throw = 'None' where name = 'Beistand (Priester)';
update public.spells set name_en = 'Sunray', casting_time = '4', saving_throw = 'Special' where name = 'Sonnenstrahl';
update public.spells set name_en = 'Symbol', casting_time = '3', saving_throw = 'Special' where name = 'Symbol (Priester)';
update public.spells set name_en = 'Transmute Metal to Wood', casting_time = '8', saving_throw = 'Special' where name = 'Metall zu Holz';
update public.spells set name_en = 'Wind Walk', casting_time = '1 round', saving_throw = 'None' where name = 'Windwandeln';
