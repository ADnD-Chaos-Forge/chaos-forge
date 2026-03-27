-- ═══════════════════════════════════════════════════════════════════════════════
-- Ausführlichere Zauber-Beschreibungen für die 50 wichtigsten Zauber
-- Wizard Level 1–4 + Priest Level 1–3
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── WIZARD LEVEL 1 ──────────────────────────────────────────────────────────

update public.spells set
  description = 'Erzeugt 1 magisches Geschoss pro 2 Stufen (max. 5 bei Stufe 9). Jedes Geschoss trifft automatisch (kein Trefferwurf nötig) und verursacht 1W4+1 Schaden. Die Geschosse können auf verschiedene Ziele in Reichweite (60 Yard + 10/Stufe) verteilt werden. Kein Rettungswurf möglich. Der Zauber wird durch den Zauber Schild vollständig blockiert.',
  description_en = 'Creates 1 magic missile per 2 caster levels (max 5 at level 9). Each missile hits automatically (no attack roll needed) and deals 1d4+1 damage. Missiles can be distributed among multiple targets within range (60 yards + 10/level). No saving throw allowed. The spell is completely blocked by the Shield spell.'
where name = 'Magisches Geschoss';

update public.spells set
  description = 'Versetzt Kreaturen mit insgesamt bis zu 2W4 Trefferwürfeln in einen magischen Schlaf. Betrifft Wesen in einem Radius von 15 Fuß im Wirkungsbereich (30 Yard). Kreaturen mit den wenigsten TW werden zuerst betroffen. Schlafende Kreaturen sind hilflos und können mit einem Angriff automatisch getötet werden. Kein Rettungswurf erlaubt, wirkt aber nicht gegen Untote oder Kreaturen über 4+3 TW.',
  description_en = 'Puts creatures with a total of up to 2d4 Hit Dice into a magical sleep. Affects beings within a 15-foot radius in the area of effect (30 yards). Creatures with the fewest HD are affected first. Sleeping creatures are helpless and can be automatically killed with an attack. No saving throw allowed, but does not affect undead or creatures above 4+3 HD.'
where name = 'Schlaf';

update public.spells set
  description = 'Erschafft eine unsichtbare magische Barriere um den Zaubernden. Verbessert die Rüstungsklasse um 1 gegen Nahkampf und um 2 gegen Fernkampf (zusätzlich zu anderer Rüstung). Blockiert Magische Geschosse vollständig. Dauer beträgt 5 Runden pro Stufe. Kein Rettungswurf nötig, da nur den Zaubernden selbst betroffen ist.',
  description_en = 'Creates an invisible magical barrier around the caster. Improves armor class by 1 against melee and by 2 against ranged attacks (in addition to other armor). Completely blocks Magic Missiles. Duration is 5 rounds per level. No saving throw needed as it only affects the caster.'
where name = 'Schild';

update public.spells set
  description = 'Verzaubert eine humanoide Kreatur mit 4 oder weniger Trefferwürfeln, die den Zaubernden als vertrauenswürdigen Verbündeten betrachtet. Die Wirkungsdauer hängt vom Charisma des Zaubernden ab und kann Stunden dauern. Rettungswurf gegen Zauber negiert den Effekt. Jede feindliche Handlung gegen das Ziel bricht den Zauber sofort. Wirkt nicht gegen Untote oder Kreaturen, die immun gegen Bezauberung sind.',
  description_en = 'Charms a humanoid creature of 4 or fewer Hit Dice, causing it to regard the caster as a trusted ally. Duration depends on the caster''s Charisma and can last for hours. Saving throw vs. spell negates the effect. Any hostile action against the target breaks the spell immediately. Does not work on undead or creatures immune to charm.'
where name = 'Person Bezaubern';

update public.spells set
  description = 'Erzeugt einen kegelförmigen Farbblitz (5 Fuß an der Basis, 20 Fuß lang, 20 Fuß breit am Ende). Betäubt, blendet oder macht bewusstlos — je nach Trefferwürfeln der Ziele. Kreaturen bis 2 TW werden bewusstlos (2W4 Runden), 3–4 TW werden geblendet (1W4 Runden), über 4 TW werden betäubt (1 Runde). Betrifft maximal Kreaturen mit insgesamt so vielen TW wie die Stufe des Zaubernden. Kein Rettungswurf erlaubt.',
  description_en = 'Creates a cone-shaped burst of colors (5 feet at base, 20 feet long, 20 feet wide at end). Stuns, blinds, or renders unconscious — depending on targets'' Hit Dice. Creatures up to 2 HD fall unconscious (2d4 rounds), 3–4 HD are blinded (1d4 rounds), over 4 HD are stunned (1 round). Affects a maximum of creatures totaling the caster''s level in HD. No saving throw allowed.'
where name = 'Farbspray';

update public.spells set
  description = 'Erzeugt einen fächerförmigen Flammenstoß von 5 Fuß Länge aus den Händen des Zaubernden. Verursacht 1W3 Schaden +2 Punkte pro Stufe des Zaubernden (max. 1W3+20 bei Stufe 10). Alle Kreaturen im Wirkungsbereich werden getroffen. Rettungswurf gegen Zauber halbiert den Schaden. Reichweite ist nur 5 Fuß, daher ein riskanter Nahkampfzauber.',
  description_en = 'Creates a fan-shaped jet of flame 5 feet long from the caster''s hands. Deals 1d3 damage +2 points per caster level (max 1d3+20 at level 10). All creatures in the area of effect are hit. Saving throw vs. spell halves the damage. Range is only 5 feet, making this a risky close-combat spell.'
where name = 'Brennende Hände';

update public.spells set
  description = 'Ermöglicht es dem Zaubernden, magische Auren auf Gegenständen, Kreaturen oder Bereichen in einem 10-Fuß-Radius (Reichweite 60 Yard) zu erkennen. Zeigt an, ob Magie vorhanden ist, aber nicht deren Art oder Stärke. Dauer beträgt 2 Runden pro Stufe. Kann durch dicke Wände, Blei oder starke magische Abschirmung blockiert werden. Kein Rettungswurf nötig.',
  description_en = 'Allows the caster to detect magical auras on objects, creatures, or areas within a 10-foot radius (range 60 yards). Indicates whether magic is present but not its type or strength. Duration is 2 rounds per level. Can be blocked by thick walls, lead, or strong magical shielding. No saving throw needed.'
where name = 'Magie Entdecken';

update public.spells set
  description = 'Enthüllt die magischen Eigenschaften eines einzelnen Gegenstands. Benötigt 8 Stunden Forschungszeit und eine Perle im Wert von 100 GM als Materialkomponente (wird verbraucht). Chance von 10% pro Stufe, eine Eigenschaft zu identifizieren. Jeder Versuch kostet den Zaubernden 8 Konstitutionspunkte (temporär). Der Zauber ist erschöpfend und riskant bei niedrigem Level.',
  description_en = 'Reveals the magical properties of a single item. Requires 8 hours of research time and a pearl worth 100 gp as material component (consumed). 10% chance per caster level to identify one property. Each attempt costs the caster 8 Constitution points (temporarily). The spell is exhausting and risky at low levels.'
where name = 'Magie Identifizieren';

update public.spells set
  description = 'Verlangsamt die Fallgeschwindigkeit einer Kreatur oder eines Gegenstands auf 2 Fuß pro Sekunde (sicheres Tempo). Schützt vor Fallschaden für die Dauer von 1 Runde pro Stufe. Kann auf den Zaubernden selbst oder auf ein Ziel innerhalb von 10 Yard pro Stufe gewirkt werden. Muss gewirkt werden, bevor der Aufprall erfolgt. Kein Rettungswurf nötig, da nur hilfreich.',
  description_en = 'Slows the falling speed of a creature or object to 2 feet per second (safe rate). Protects against falling damage for 1 round per level. Can be cast on the caster or on a target within 10 yards per level. Must be cast before impact occurs. No saving throw needed as the effect is beneficial.'
where name = 'Federfall';

update public.spells set
  description = 'Erzeugt ein helles Licht in einem Radius von 20 Fuß um den Zielpunkt (Reichweite 60 Yard). Dauer beträgt 1 Stunde pro Stufe. Kann auf einen Gegenstand gewirkt werden, der dann als Lichtquelle dient. Wird auf die Augen einer Kreatur gewirkt, verursacht es Blendung (–4 auf Trefferwürfe) bei erfolglosem Rettungswurf gegen Zauber. Wird durch den Dunkelheit-Zauber aufgehoben.',
  description_en = 'Creates bright light in a 20-foot radius around the target point (range 60 yards). Duration is 1 hour per level. Can be cast on an object which then serves as a light source. If cast at a creature''s eyes, it causes blindness (–4 to attack rolls) on a failed saving throw vs. spell. Negated by a Darkness spell.'
where name = 'Licht (Magier)';

update public.spells set
  description = 'Ermöglicht es dem Zaubernden, die Bedeutung von geschriebenen oder gesprochenen Sprachen zu verstehen, die ihm unbekannt sind. Dauer beträgt 5 Runden pro Stufe. Erlaubt das Lesen von Inschriften, Schriftrollen und ähnlichem, aber nicht das Sprechen oder Schreiben der Sprache. Magisch verschlüsselte Texte oder Codes werden nicht entziffert. Kein Rettungswurf nötig.',
  description_en = 'Allows the caster to understand the meaning of written or spoken languages unknown to them. Duration is 5 rounds per level. Permits reading inscriptions, scrolls, and similar texts but not speaking or writing the language. Magically encrypted texts or codes are not deciphered. No saving throw needed.'
where name = 'Sprachen Verstehen';

update public.spells set
  description = 'Verändert die Größe einer Kreatur oder eines Gegenstands um 10% pro Stufe (Vergrößerung oder Verkleinerung). Das Gewicht ändert sich proportional zur Größenänderung. Reichweite von 5 Yard pro Stufe, Dauer beträgt 1 Stunde pro Stufe. Unfreiwillige Ziele erhalten einen Rettungswurf gegen Zauber. Magische Gegenstände sind vom Zauber nicht betroffen.',
  description_en = 'Changes the size of a creature or object by 10% per caster level (enlargement or reduction). Weight changes proportionally to the size change. Range of 5 yards per level, duration is 1 hour per level. Unwilling targets receive a saving throw vs. spell. Magical items are not affected by this spell.'
where name = 'Vergrößern';

update public.spells set
  description = 'Verleiht dem Zaubernden die Fähigkeit, an Wänden und Decken zu klettern wie eine Spinne. Bewegungsrate beträgt 6 (halbe normale Geschwindigkeit). Dauer ist 3 Runden + 1 Runde pro Stufe. Nur der Zaubernde selbst wird betroffen. Hände müssen frei sein, um zu klettern — Kampf während des Kletterns ist nicht möglich. Kein Rettungswurf nötig.',
  description_en = 'Grants the caster the ability to climb walls and ceilings like a spider. Movement rate is 6 (half normal speed). Duration is 3 rounds + 1 round per level. Only affects the caster. Hands must be free to climb — combat while climbing is not possible. No saving throw needed.'
where name = 'Spinnenklettern';

update public.spells set
  description = 'Schützt einen Bereich von bis zu 20 Fuß Radius vor unbefugtem Betreten. Wenn eine Kreatur den geschützten Bereich betritt, ertönt ein mentaler oder hörbarer Alarm. Der mentale Alarm weckt den Zaubernden aus dem Schlaf. Dauer beträgt 4 Stunden + 30 Minuten pro Stufe. Kein Rettungswurf — der Alarm wird durch jede Kreatur über der Größe einer Ratte ausgelöst.',
  description_en = 'Protects an area of up to 20-foot radius from unauthorized entry. When a creature enters the protected area, a mental or audible alarm sounds. The mental alarm wakes the caster from sleep. Duration is 4 hours + 30 minutes per level. No saving throw — the alarm is triggered by any creature larger than a rat.'
where name = 'Alarm';

-- ─── WIZARD LEVEL 2 ──────────────────────────────────────────────────────────

update public.spells set
  description = 'Macht den Zaubernden oder eine berührte Kreatur vollständig unsichtbar, inklusive Ausrüstung. Dauer beträgt 24 Stunden, endet aber sofort bei einem Angriff oder dem Wirken eines offensiven Zaubers. Unsichtbare Kreaturen erhalten +4 auf Überraschungswürfe und Gegner haben –4 auf Trefferwürfe gegen sie. Kreaturen, die Unsichtbares sehen können (z.B. durch Magie), sind nicht betroffen.',
  description_en = 'Makes the caster or a touched creature completely invisible, including equipment. Duration is 24 hours but ends immediately upon attacking or casting an offensive spell. Invisible creatures gain +4 to surprise rolls and opponents suffer –4 to attack rolls against them. Creatures that can see invisible things (e.g., through magic) are not affected.'
where name = 'Unsichtbarkeit';

update public.spells set
  description = 'Öffnet verschlossene oder magisch versiegelte Türen, Truhen, Ketten und ähnliche Verschlüsse. Öffnet bis zu 2 Verschlüsse im Wirkungsbereich (60 Yard). Wirkt gegen normale Schlösser, Riegel, und magisch gehaltene Türen (Hold Portal). Öffnet keine Fallen und löst sie auch nicht aus. Ein einzelner Klopfen-Zauber kann sogar einen Magie-Schloss-Zauber temporär (1 Runde) unterdrücken. Kein Rettungswurf.',
  description_en = 'Opens locked or magically sealed doors, chests, chains, and similar closures. Opens up to 2 closures within range (60 yards). Works against normal locks, bars, and magically held doors (Hold Portal). Does not open traps or disarm them. A single Knock spell can even temporarily suppress a Wizard Lock spell (1 round). No saving throw.'
where name = 'Klopfen';

update public.spells set
  description = 'Erschafft 1W4+1 illusionäre Doppelgänger des Zaubernden, die sich mit ihm bewegen. Angreifer können nicht erkennen, welches Bild das echte ist, und müssen zufällig ein Bild angreifen. Jeder erfolgreiche Treffer auf ein Trugbild lässt dieses verschwinden. Dauer beträgt 3 Runden pro Stufe. Flächenzauber zerstören alle Bilder gleichzeitig. Kein Rettungswurf, da die Bilder eine echte visuelle Täuschung sind.',
  description_en = 'Creates 1d4+1 illusory duplicates of the caster that move with them. Attackers cannot tell which image is real and must randomly target an image. Each successful hit on a duplicate causes it to vanish. Duration is 3 rounds per level. Area effect spells destroy all images simultaneously. No saving throw as the images are a genuine visual illusion.'
where name = 'Spiegelbild';

update public.spells set
  description = 'Erschafft ein klebriges, starkes Netz in einem Bereich von 10×10×10 Fuß (Reichweite 5 Yard pro Stufe). Gefangene Kreaturen müssen ihre Stärke gegen den Zauber einsetzen: unter 13 STR brauchen 2W4 Runden zum Befreien, 13–17 STR brauchen 1W4 Runden, 18+ STR befreit sich in 1 Runde. Das Netz ist brennbar und kann in 2 Runden abgefackelt werden (verursacht 2W4 Feuerschaden an Gefangenen). Dauer beträgt 2 Runden pro Stufe.',
  description_en = 'Creates a sticky, strong web filling a 10×10×10-foot area (range 5 yards per level). Trapped creatures must use their Strength against the spell: below 13 STR takes 2d4 rounds to break free, 13–17 STR takes 1d4 rounds, 18+ STR escapes in 1 round. The web is flammable and can be burned away in 2 rounds (dealing 2d4 fire damage to trapped creatures). Duration is 2 rounds per level.'
where name = 'Netz';

update public.spells set
  description = 'Erzeugt eine Wolke aus widerlichem Gas in einem Würfel von 20 Fuß Seitenlänge (Reichweite 30 Yard). Kreaturen in der Wolke müssen einen Rettungswurf gegen Gift bestehen oder werden für 1W4+1 Runden hilflos durch Würgen und Übelkeit. Selbst bei erfolgreichem Rettungswurf sind Aktionen auf –2 eingeschränkt. Dauer beträgt 1 Runde pro Stufe, die Wolke driftet mit dem Wind. Wirkt nicht gegen Kreaturen, die nicht atmen müssen.',
  description_en = 'Creates a cloud of nauseous gas in a 20-foot cube (range 30 yards). Creatures in the cloud must make a saving throw vs. poison or become helpless for 1d4+1 rounds from retching and nausea. Even on a successful save, actions are at –2 penalty. Duration is 1 round per level and the cloud drifts with the wind. Does not affect creatures that do not need to breathe.'
where name = 'Stinkende Wolke';

update public.spells set
  description = 'Erzeugt magische Dunkelheit in einem Radius von 15 Fuß um den Zielpunkt (Reichweite 10 Yard pro Stufe). Keine normale oder magische Lichtquelle unter der zweiten Stufe kann die Dunkelheit durchdringen. Dauer beträgt 1 Stunde pro Stufe. Kann auf einen Gegenstand gewirkt werden, um eine tragbare Dunkelheitszone zu schaffen. Hebt einen Licht-Zauber auf und wird durch diesen aufgehoben. Infrarot-Sicht funktioniert in der Dunkelheit nicht.',
  description_en = 'Creates magical darkness in a 15-foot radius around the target point (range 10 yards per level). No normal or magical light source below 2nd level can penetrate the darkness. Duration is 1 hour per level. Can be cast on an object to create a portable darkness zone. Cancels a Light spell and is cancelled by one. Infravision does not function within the darkness.'
where name = 'Dunkelheit 15 Fuß Radius';

update public.spells set
  description = 'Erhöht den Stärke-Wert einer berührten Kreatur temporär. Krieger erhalten 1W8 STR-Punkte, Priester 1W6, Diebe 1W6, Magier 1W4. Ein Krieger, der auf 18 steigt, erhält auch Ausnahmestärke (zufällig). Dauer beträgt 1 Stunde pro Stufe. Kann die Stärke nicht über 18/00 (bzw. rassisches Maximum) hinaus steigern. Nur einmal gleichzeitig auf eine Kreatur anwendbar.',
  description_en = 'Temporarily increases the Strength score of a touched creature. Warriors gain 1d8 STR points, priests 1d6, rogues 1d6, wizards 1d4. A warrior reaching 18 also gains exceptional strength (random percentile). Duration is 1 hour per level. Cannot increase Strength beyond 18/00 (or racial maximum). Only one instance can affect a creature at a time.'
where name = 'Stärke';

update public.spells set
  description = 'Ermöglicht dem Zaubernden, sich vertikal frei zu bewegen — aufwärts oder abwärts mit einer Geschwindigkeit von 2 Fuß pro Runde (nach oben) oder 10 Fuß pro Runde (nach unten). Horizontale Bewegung ist nur durch Abstoßen von Oberflächen möglich. Dauer beträgt 1 Runde pro Stufe. Wenn der Zauber endet, während der Zaubernde in der Luft ist, sinkt er langsam für 1W6 Runden ab. Kein Rettungswurf nötig.',
  description_en = 'Allows the caster to move vertically — up at 2 feet per round or down at 10 feet per round. Horizontal movement is only possible by pushing off surfaces. Duration is 1 round per level. If the spell ends while the caster is airborne, they descend slowly for 1d6 rounds. No saving throw needed.'
where name = 'Levitieren';

update public.spells set
  description = 'Beendet aktive Zauberwirkungen auf einem Ziel, Gegenstand oder Bereich (30-Fuß-Würfel). Grundchance von 50%, modifiziert um 5% pro Stufendifferenz zwischen Zauberndem und Zielzauber-Wirkerstufe. Kann gegen mehrere Zauber gleichzeitig eingesetzt werden, wobei jeder separat gewürfelt wird. Wirkt nicht gegen magische Gegenstände (außer deren temporäre Effekte). Kein Rettungswurf — Erfolg wird pro Zauber einzeln bestimmt.',
  description_en = 'Ends active spell effects on a target, object, or area (30-foot cube). Base 50% chance of success, modified by 5% per level difference between caster and target spell''s caster level. Can be used against multiple spells simultaneously, with each rolled separately. Does not work against magical items (except their temporary effects). No saving throw — success is determined individually per spell.'
where name = 'Magie Bannen (Magier)';

-- ─── WIZARD LEVEL 3 ──────────────────────────────────────────────────────────

update public.spells set
  description = 'Schleudert eine erbsengroße Flamme, die am Zielpunkt in einer gewaltigen Explosion detoniert. Verursacht 1W6 Schaden pro Stufe des Zaubernden (max. 10W6) in einem Radius von 20 Fuß. Rettungswurf gegen Zauber halbiert den Schaden. Reichweite beträgt 10 Yard + 10 pro Stufe. Der Feuerball dehnt sich um Ecken aus und füllt sein gesamtes Volumen — in engen Räumen kann er den Zaubernden selbst treffen! Entzündet brennbare Gegenstände.',
  description_en = 'Hurls a pea-sized flame that detonates at the target point in a massive explosion. Deals 1d6 damage per caster level (max 10d6) in a 20-foot radius. Saving throw vs. spell halves the damage. Range is 10 yards + 10 per level. The fireball expands around corners and fills its entire volume — in confined spaces it can hit the caster! Ignites flammable objects.'
where name = 'Feuerball';

update public.spells set
  description = 'Erzeugt einen Blitz von 5 Fuß Breite und 40 Fuß + 10 Fuß pro Stufe Länge aus der Fingerspitze des Zaubernden. Verursacht 1W6 Schaden pro Stufe (max. 10W6). Rettungswurf gegen Zauber halbiert den Schaden. Der Blitz prallt von Wänden und Oberflächen ab, was die effektive Reichweite verlängern oder den Zaubernden selbst treffen kann. Entzündet brennbare Materialien und schmilzt Metalle mit niedrigem Schmelzpunkt.',
  description_en = 'Creates a lightning bolt 5 feet wide and 40 feet + 10 feet per level long from the caster''s fingertip. Deals 1d6 damage per caster level (max 10d6). Saving throw vs. spell halves the damage. The bolt rebounds off walls and surfaces, which can extend effective range or hit the caster. Ignites flammable materials and melts metals with low melting points.'
where name = 'Blitz';

update public.spells set
  description = 'Beschleunigt 1 Kreatur pro Stufe in einem Bereich von 40-Fuß-Würfel, sodass jede betroffene Kreatur doppelt so schnell handeln kann. Betroffene erhalten eine zusätzliche Attacke pro Runde und doppelte Bewegungsrate. Dauer beträgt 3 Runden + 1 pro Stufe. ACHTUNG: Jede beschleunigte Kreatur altert magisch um 1 Jahr. Hebt den Zauber Langsam auf und wird durch diesen aufgehoben. Kein Rettungswurf (da hilfreich).',
  description_en = 'Speeds up 1 creature per level in a 40-foot cube area, allowing each affected creature to act at double speed. Affected targets gain one additional attack per round and double movement rate. Duration is 3 rounds + 1 per level. WARNING: Each hasted creature magically ages 1 year. Cancels the Slow spell and is cancelled by it. No saving throw (beneficial effect).'
where name = 'Hast';

update public.spells set
  description = 'Verleiht dem Zaubernden die Fähigkeit zu fliegen mit einer Bewegungsrate von 18 (doppelte normale Laufgeschwindigkeit). Erlaubt Steigen, Sinken, Schweben und beliebige Richtungsänderungen. Dauer beträgt 1 Stunde pro Stufe + 1W6 Runden (der Zaubernde weiß nicht genau, wann der Zauber endet). Am Ende des Zaubers sinkt der Zaubernde die letzte Runde sanft ab. Kein Rettungswurf nötig.',
  description_en = 'Grants the caster the ability to fly at a movement rate of 18 (double normal walking speed). Allows climbing, descending, hovering, and arbitrary direction changes. Duration is 1 hour per level + 1d6 rounds (the caster does not know exactly when the spell will end). At the end of the spell, the caster descends gently during the last round. No saving throw needed.'
where name = 'Fliegen';

update public.spells set
  description = 'Verlangsamt 1 Kreatur pro Stufe in einem Bereich von 40-Fuß-Würfel auf die halbe Geschwindigkeit. Betroffene können nur jede zweite Runde angreifen und haben halbierte Bewegungsrate. Rettungswurf gegen Zauber negiert den Effekt. Dauer beträgt 3 Runden + 1 pro Stufe. Hebt den Zauber Hast auf und wird durch diesen aufgehoben. Sehr effektiv gegen große Gruppen von Feinden.',
  description_en = 'Slows 1 creature per level in a 40-foot cube area to half speed. Affected targets can only attack every other round and have halved movement rate. Saving throw vs. spell negates the effect. Duration is 3 rounds + 1 per level. Cancels the Haste spell and is cancelled by it. Very effective against large groups of enemies.'
where name = 'Langsam';

update public.spells set
  description = 'Wie der Unsichtbarkeits-Zauber, aber betrifft alle verbündeten Kreaturen innerhalb von 10 Fuß um den Zaubernden zum Zeitpunkt des Wirkens. Kreaturen, die den 10-Fuß-Radius verlassen, bleiben unsichtbar. Dauer und Einschränkungen wie bei normaler Unsichtbarkeit — ein Angriff oder offensiver Zauber bricht die Unsichtbarkeit nur für die handelnde Kreatur. Ideal für Gruppen-Infiltration.',
  description_en = 'Like the Invisibility spell, but affects all allied creatures within 10 feet of the caster at the time of casting. Creatures that leave the 10-foot radius remain invisible. Duration and limitations as normal Invisibility — an attack or offensive spell breaks invisibility only for the acting creature. Ideal for group infiltration.'
where name = 'Unsichtbarkeit 10 Fuß Radius';

update public.spells set
  description = 'Beendet aktive Zauberwirkungen auf einem Ziel, Gegenstand oder Bereich (30-Fuß-Würfel). Grundchance von 50%, modifiziert um 5% pro Stufendifferenz zwischen Zauberndem und Zielzauber-Wirkerstufe. Kann gegen mehrere Zauber gleichzeitig eingesetzt werden, wobei jeder separat gewürfelt wird. Wirkt nicht gegen magische Gegenstände (außer deren temporäre Effekte). Kein Rettungswurf — Erfolg wird pro Zauber einzeln bestimmt.',
  description_en = 'Ends active spell effects on a target, object, or area (30-foot cube). Base 50% chance of success, modified by 5% per level difference between caster and target spell''s caster level. Can be used against multiple spells simultaneously, with each rolled separately. Does not work against magical items (except their temporary effects). No saving throw — success is determined individually per spell.'
where name = 'Dispel Magic';

update public.spells set
  description = 'Erschafft eine leuchtende magische Barriere, die Böse Kreaturen daran hindert, einen 10-Fuß-Radius um den Zaubernden zu betreten. Böse Kreaturen erhalten –2 auf Trefferwürfe gegen geschützte Kreaturen im Kreis. Herbeigerufene oder beschworene böse Kreaturen können den Kreis nicht durchbrechen, solange niemand im Kreis sie angreift. Dauer beträgt 2 Runden pro Stufe. Kein Rettungswurf, aber nur gegen böse Kreaturen wirksam.',
  description_en = 'Creates a luminous magical barrier that prevents evil creatures from entering a 10-foot radius around the caster. Evil creatures suffer –2 to attack rolls against protected creatures within the circle. Summoned or conjured evil creatures cannot breach the circle as long as no one inside attacks them. Duration is 2 rounds per level. No saving throw, but only effective against evil creatures.'
where name = 'Schutzkreis gegen Böses';

-- ─── WIZARD LEVEL 4 ──────────────────────────────────────────────────────────

update public.spells set
  description = 'Teleportiert den Zaubernden sofort über eine Distanz von bis zu 360 Yard (ohne Fehlerchance, anders als Teleportation). Kann nur den Zaubernden selbst und seine getragene Ausrüstung transportieren. Das Ziel muss nicht sichtbar sein, aber die Richtung und ungefähre Entfernung müssen bekannt sein. Kein Rettungswurf nötig. Kann benutzt werden, um aus Fesseln oder Gefangenschaft zu entkommen, solange der Zaubernde sprechen kann.',
  description_en = 'Instantly teleports the caster up to 360 yards (without error chance, unlike Teleport). Can only transport the caster and their carried equipment. The destination need not be visible, but the direction and approximate distance must be known. No saving throw needed. Can be used to escape bonds or captivity as long as the caster can speak.'
where name = 'Dimension Door';

update public.spells set
  description = 'Verwandelt den Zaubernden in jede bekannte Kreatur von der Größe einer Ratte bis zur Größe eines Elefanten. Der Zaubernde behält seine Trefferpunkte und geistigen Werte (INT, WIS, CHA). Erhält die Bewegungsform der neuen Gestalt (Fliegen, Schwimmen, etc.) und natürliche Angriffe. Dauer beträgt 1 Stunde pro Stufe. Besondere magische Fähigkeiten der Kreatur (Drachenodem, Petrifikation etc.) werden nicht erlangt. Kein Rettungswurf.',
  description_en = 'Transforms the caster into any known creature from rat-sized to elephant-sized. The caster retains their hit points and mental scores (INT, WIS, CHA). Gains the movement form of the new shape (flying, swimming, etc.) and natural attacks. Duration is 1 hour per level. Special magical abilities of the creature (dragon breath, petrification, etc.) are not gained. No saving throw.'
where name = 'Polymorph Self';

update public.spells set
  description = 'Erzeugt einen Hagelsturm in einem zylindrischen Bereich von 40 Fuß Durchmesser und 40 Fuß Höhe (Reichweite 5 Yard pro Stufe). Verursacht 3W10 Aufprallschaden durch Hagelkörner. Kein Rettungswurf gegen den Hagelschaden. Alternativ kann der Zauber als Schneesturm gewirkt werden, der keinen Schaden verursacht, aber Sicht blockiert und Bewegung behindert für 1 Runde. Besonders effektiv im Freien.',
  description_en = 'Creates a hailstorm in a cylindrical area 40 feet in diameter and 40 feet high (range 5 yards per level). Deals 3d10 impact damage from hailstones. No saving throw against the hail damage. Alternatively, can be cast as a sleet storm that deals no damage but blocks vision and hinders movement for 1 round. Particularly effective outdoors.'
where name = 'Eis-Sturm';

update public.spells set
  description = 'Umgibt die Haut des Zaubernden mit einer steinernen Schutzschicht, die eine bestimmte Anzahl physischer Treffer absorbiert. Absorbiert 1W4+1 Treffer (unabhängig vom Schaden pro Treffer), bevor die Wirkung aufgebraucht ist. Dauer ist bis zur Erschöpfung aller Ladungen oder bis zum Wirken eines weiteren Stoneskin. Schützt nicht gegen magischen Schaden oder Flächenzauber. Mehrfaches Wirken ist nicht kumulativ — nur der neueste Zauber zählt.',
  description_en = 'Surrounds the caster''s skin with a stony protective layer that absorbs a number of physical hits. Absorbs 1d4+1 hits (regardless of damage per hit) before the effect is exhausted. Duration lasts until all charges are used or another Stoneskin is cast. Does not protect against magical damage or area effect spells. Multiple castings are not cumulative — only the most recent spell counts.'
where name = 'Stoneskin';

-- ─── PRIEST LEVEL 1 ──────────────────────────────────────────────────────────

update public.spells set
  description = 'Heilt 1W8 Trefferpunkte bei einer berührten Kreatur. Kann nicht über das Maximum der Trefferpunkte hinaus heilen. Der grundlegendste und häufigste Heilzauber im Spiel. Wirkt umgekehrt gegen Untote als Leichte Wunden Verursachen (1W8 Schaden, Rettungswurf negiert). Kann nicht auf Konstrukte oder andere nicht-lebende Wesen gewirkt werden. Heilt keine Krankheiten oder Gift.',
  description_en = 'Heals 1d8 hit points on a touched creature. Cannot heal above the target''s maximum hit points. The most basic and common healing spell in the game. Works in reverse against undead as Cause Light Wounds (1d8 damage, saving throw negates). Cannot be cast on constructs or other non-living beings. Does not cure diseases or poison.'
where name = 'Leichte Wunden Heilen';

update public.spells set
  description = 'Gewährt allen Verbündeten in einem Bereich von 50 Fuß (zentriert auf den Priester) einen Bonus von +1 auf Trefferwürfe und +1 auf Rettungswürfe gegen Furcht. Dauer beträgt 6 Runden. Verbündete müssen den Priester beim Wirken des Zaubers hören können. Gleichzeitig erhalten Feinde im Wirkungsbereich –1 auf Moral-Würfe. Kann nicht mit einem zweiten Segnen kumuliert werden.',
  description_en = 'Grants all allies in a 50-foot area (centered on the priest) a +1 bonus to attack rolls and +1 to saving throws against fear. Duration is 6 rounds. Allies must be able to hear the priest when the spell is cast. Simultaneously, enemies in the area of effect suffer –1 to morale checks. Cannot be stacked with a second Bless spell.'
where name = 'Segnen';

update public.spells set
  description = 'Zwingt eine einzelne Kreatur innerhalb von 30 Yard, einen einzigen, ein Wort langen Befehl des Priesters zu befolgen (z.B. „Flieh!", „Schlaf!", „Fall!"). Rettungswurf gegen Zauber negiert den Effekt. Der Befehl wird für 1 Runde befolgt und darf nicht direkt selbstmörderisch sein. Wirkt nicht gegen Kreaturen mit Intelligenz 13+ oder Untote. Besonders effektiv im Kampf, um einen Gegner eine Runde lang außer Gefecht zu setzen.',
  description_en = 'Compels a single creature within 30 yards to obey a single one-word command from the priest (e.g., "Flee!", "Sleep!", "Fall!"). Saving throw vs. spell negates the effect. The command is obeyed for 1 round and must not be directly suicidal. Does not work against creatures with Intelligence 13+ or undead. Particularly effective in combat to disable an opponent for one round.'
where name = 'Befehl';

update public.spells set
  description = 'Umgibt den Priester mit einer schützenden Aura, die Feinde davon abhält, ihn anzugreifen. Jede Kreatur, die den Priester angreifen will, muss einen Rettungswurf gegen Zauber bestehen, sonst wendet sie sich einem anderen Ziel zu. Dauer beträgt 2 Runden pro Stufe. Der Effekt endet sofort, wenn der Priester eine offensive Handlung durchführt (Angriff oder Schadenzauber). Ideal für Priester, die sich auf Heilung konzentrieren wollen.',
  description_en = 'Surrounds the priest with a protective aura that discourages enemies from attacking them. Any creature that wishes to attack the priest must make a saving throw vs. spell or turn to another target. Duration is 2 rounds per level. The effect ends immediately if the priest takes an offensive action (attack or damage spell). Ideal for priests who want to focus on healing.'
where name = 'Heiligtum';

update public.spells set
  description = 'Ermöglicht es dem Priester, die Aura des Bösen in einem Bereich von 10 Fuß Breite und bis zu 60 Fuß Länge zu erkennen. Zeigt Stärke und Richtung böser Emanationen von Kreaturen, Gegenständen oder verfluchten Bereichen an. Dauer beträgt 1 Runde pro Stufe + 1 Stunde. Kann durch Blei blockiert werden. Zeigt nicht die genaue Natur des Bösen, nur dessen Anwesenheit und Intensität. Kein Rettungswurf.',
  description_en = 'Allows the priest to detect the aura of evil in an area 10 feet wide and up to 60 feet long. Shows strength and direction of evil emanations from creatures, objects, or cursed areas. Duration is 1 round per level + 1 hour. Can be blocked by lead. Does not show the exact nature of evil, only its presence and intensity. No saving throw.'
where name = 'Böses Erkennen';

-- ─── PRIEST LEVEL 2 ──────────────────────────────────────────────────────────

update public.spells set
  description = 'Hält 1–4 humanoide Kreaturen in magischer Paralyse fest (max. Menschengröße). Einzelnes Ziel: Rettungswurf gegen Paralyse mit –2 Strafe. Mehrere Ziele: normaler Rettungswurf. Dauer beträgt 2 Runden pro Stufe. Betroffene Kreaturen sind vollständig gelähmt, können aber atmen und wahrnehmen. Der Effekt kann durch Magie Bannen aufgehoben werden. Wirkt nicht gegen Untote oder Kreaturen größer als Oger.',
  description_en = 'Holds 1–4 humanoid creatures in magical paralysis (up to human-sized). Single target: saving throw vs. paralysis at –2 penalty. Multiple targets: normal saving throw. Duration is 2 rounds per level. Affected creatures are completely paralyzed but can still breathe and perceive. The effect can be removed by Dispel Magic. Does not work against undead or creatures larger than ogre-sized.'
where name = 'Person Festhalten';

update public.spells set
  description = 'Erschafft eine schwebende, leuchtende Waffe (Form nach Wahl des Priesters), die autonom kämpft. Die Waffe greift mit der THAC0 des Priesters an und verursacht 1W6+1 Schaden pro Treffer. Dauer beträgt 3 Runden + 1 pro Stufe. Die Waffe hat AC 4 und kann mit magischen Waffen zerstört werden. Kann sich bis zu 30 Fuß vom Priester entfernen. Erfordert keine Konzentration nach dem Wirken.',
  description_en = 'Creates a floating, glowing weapon (shape chosen by the priest) that fights autonomously. The weapon attacks using the priest''s THAC0 and deals 1d6+1 damage per hit. Duration is 3 rounds + 1 per level. The weapon has AC 4 and can be destroyed by magical weapons. Can move up to 30 feet from the priest. Does not require concentration after casting.'
where name = 'Geistliche Waffe';

update public.spells set
  description = 'Erschafft eine Zone absoluter Stille in einem Radius von 15 Fuß (Reichweite 120 Yard). Innerhalb der Zone kann kein Geräusch erzeugt oder gehört werden. Verhindert das Wirken von Zaubern mit verbalen Komponenten. Dauer beträgt 2 Runden pro Stufe. Kann auf einen Gegenstand oder eine Kreatur gewirkt werden (Rettungswurf gegen Zauber negiert bei unfreiwilligem Ziel). Sehr effektiv, um feindliche Zauberer am Wirken zu hindern.',
  description_en = 'Creates a zone of absolute silence in a 15-foot radius (range 120 yards). Within the zone, no sound can be made or heard. Prevents casting of spells with verbal components. Duration is 2 rounds per level. Can be cast on an object or creature (saving throw vs. spell negates for unwilling targets). Very effective at preventing enemy spellcasters from casting.'
where name = 'Stille 15 Fuß Radius';

update public.spells set
  description = 'Ermöglicht es dem Priester, Fallen in einem Bereich von 10 Fuß Breite und 30 Fuß Länge zu entdecken (Reichweite 30 Yard). Zeigt die Anwesenheit von mechanischen und magischen Fallen an, aber nicht deren genaue Art oder Entschärfungsmethode. Entdeckungschance ist Stufenabhängig. Dauer ist 3 Runden. Kann auch verwendet werden, um zu erkennen, ob ein Bereich mit einer Todeszauberfalle oder ähnlichem belegt ist.',
  description_en = 'Allows the priest to detect traps in an area 10 feet wide and 30 feet long (range 30 yards). Shows the presence of mechanical and magical traps but not their exact type or disarming method. Detection chance is level-dependent. Duration is 3 rounds. Can also be used to detect whether an area is warded with a death spell trap or similar effect.'
where name = 'Falle Finden';

update public.spells set
  description = 'Verlangsamt die Wirkung von Gift bei einer berührten Kreatur, sodass der Tod oder die schädlichen Effekte um 1 Stunde pro Stufe des Priesters verzögert werden. Heilt das Gift nicht, sondern gibt der Gruppe Zeit, ein richtiges Gegenmittel oder den Zauber Gift Neutralisieren zu finden. Kann sofort nach einem Giftangriff gewirkt werden. Kein Rettungswurf nötig (da hilfreich). Funktioniert gegen alle Arten von Gift.',
  description_en = 'Slows the effects of poison on a touched creature, delaying death or harmful effects by 1 hour per priest level. Does not cure the poison but gives the party time to find a proper antidote or the Neutralize Poison spell. Can be cast immediately after a poison attack. No saving throw needed (beneficial effect). Works against all types of poison.'
where name = 'Langsames Gift';

-- ─── PRIEST LEVEL 3 ──────────────────────────────────────────────────────────

update public.spells set
  description = 'Heilt 2W8+1 Trefferpunkte bei einer berührten Kreatur. Kann nicht über das Maximum der Trefferpunkte hinaus heilen. Die stärkere Version von Leichte Wunden Heilen und der wichtigste Kampfheilzauber auf mittlerer Stufe. Wirkt umgekehrt als Schwere Wunden Verursachen (2W8+1 Schaden, benötigt erfolgreichen Nahkampf-Trefferwurf). Kann nicht auf Untote, Konstrukte oder Pflanzen gewirkt werden.',
  description_en = 'Heals 2d8+1 hit points on a touched creature. Cannot heal above the target''s maximum hit points. The stronger version of Cure Light Wounds and the most important mid-level combat healing spell. Works in reverse as Cause Serious Wounds (2d8+1 damage, requires a successful melee attack roll). Cannot be cast on undead, constructs, or plants.'
where name = 'Schwere Wunden Heilen';

update public.spells set
  description = 'Verstärkt alle Verbündeten im Umkreis von 60 Fuß mit göttlichem Segen: +1 auf Trefferwürfe, Schadenswürfe und Rettungswürfe. Gleichzeitig erleiden alle Feinde im selben Bereich –1 auf dieselben Würfe. Dauer beträgt 1 Runde pro Stufe. Wirkt nicht kumulativ mit dem Segnen-Zauber, da Gebet die stärkere Version ist. Der Priester muss während der gesamten Dauer konzentriert bleiben — andere Zauber wirken bricht das Gebet ab.',
  description_en = 'Empowers all allies within 60 feet with divine blessing: +1 to attack rolls, damage rolls, and saving throws. Simultaneously, all enemies in the same area suffer –1 to the same rolls. Duration is 1 round per level. Does not stack with the Bless spell as Prayer is the stronger version. The priest must maintain concentration for the entire duration — casting other spells breaks the Prayer.'
where name = 'Gebet';

update public.spells set
  description = 'Beendet aktive Zauberwirkungen auf einem Ziel, Gegenstand oder Bereich (30-Fuß-Würfel). Funktioniert identisch zur Magier-Version: Grundchance 50%, modifiziert um 5% pro Stufendifferenz. Kann gegen mehrere Zauber gleichzeitig eingesetzt werden. Einer der wichtigsten Priester-Zauber, da er Flüche, Bezauberungen und andere magische Effekte aufheben kann. Kein Rettungswurf — Erfolg wird pro Zauber einzeln bestimmt.',
  description_en = 'Ends active spell effects on a target, object, or area (30-foot cube). Functions identically to the wizard version: base 50% chance, modified by 5% per level difference. Can be used against multiple spells simultaneously. One of the most important priest spells as it can remove curses, charms, and other magical effects. No saving throw — success is determined individually per spell.'
where name = 'Magie Bannen (Priester)';

update public.spells set
  description = 'Erzeugt ein helles, tageslichtähnliches Licht in einem Radius von 60 Fuß um den Zielpunkt (Reichweite 120 Yard). Die Beleuchtung ist dauerhaft, bis sie magisch aufgehoben wird (nicht zeitbegrenzt). Kann auf einen Gegenstand gewirkt werden, der dann als dauerhafte Lichtquelle dient. Wird auf die Augen einer Kreatur gewirkt, verursacht es dauerhafte Blindheit bei erfolglosem Rettungswurf gegen Zauber. Hebt Dunkelheit-Zauber auf.',
  description_en = 'Creates bright, daylight-like illumination in a 60-foot radius around the target point (range 120 yards). The illumination is permanent until magically dispelled (not time-limited). Can be cast on an object to serve as a permanent light source. If cast at a creature''s eyes, causes permanent blindness on a failed saving throw vs. spell. Cancels Darkness spells.'
where name = 'Kontinuierliches Licht';
