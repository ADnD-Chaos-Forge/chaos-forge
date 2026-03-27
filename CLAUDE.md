# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projektübersicht

**Chaos Forge** ist ein webbasierter Charakter-Manager und Session-Tracker für AD&D 2nd Edition, gebaut für die private Spielgruppe "Chaos RPG" (max. 10 Nutzer, sehr geringe parallele Nutzung).

**Oberstes Architekturziel:** Komplett im Free-Tier betreibbar (Hosting, Datenbank, Auth).

## Tech-Stack

- **Framework:** Next.js 16 (App Router) mit TypeScript
- **Datenbank & Auth:** Supabase (PostgreSQL + Row Level Security)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **i18n:** next-intl (Cookie-basiert, DE/EN)
- **Unit-/Integrationstests:** Vitest + React Testing Library
- **E2E-Tests:** Playwright (Chromium, POM-Pattern, getByTestId)
- **Linting/Formatting:** ESLint (next config) + Prettier
- **Hosting:** Vercel (Free-Tier)
- **UI-Theme:** AD&D-Nostalgie-Look (Cinzel für Headings, Crimson Text für Body)

## Befehle

| Befehl                 | Beschreibung                       |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Dev-Server starten (Turbopack)     |
| `npm run build`        | Production Build                   |
| `npm run lint`         | ESLint ausführen                   |
| `npm run format`       | Prettier: alle Dateien formatieren |
| `npm run format:check` | Prettier: Formatierung prüfen      |
| `npm test`             | Unit-Tests einmalig ausführen      |
| `npm run test:watch`   | Unit-Tests im Watch-Modus          |
| `npm run test:e2e`     | Playwright E2E-Tests ausführen     |
| `npm run test:e2e:ui`  | Playwright im UI-Modus             |

## Projektstruktur

```
src/
  app/                    # Next.js App Router (Pages, Layouts)
    characters/[id]/      # Charakterbogen, Druckansicht, Zauberbuch
  components/
    character-sheet/      # Tabs: Stats, Combat, Equipment, Spells, Proficiencies, Thief Skills
    spellbook/            # Standalone Spellbook-Seite (Suche, Filter, Prepare, Learn)
    print-sheet/          # Druckansicht
    ui/                   # shadcn/ui Komponenten
  lib/
    rules/                # AD&D 2e Regelwerk-Engine (reine TypeScript-Logik)
      spec/               # Regelwerk-Spezifikation + Coverage-Meta-Test
      abilities.ts        # Attribut-Modifikator-Tabellen (STR inkl. 18/xx, DEX, CON, INT, WIS, CHA)
      alignment.ts        # 9 Gesinnungen, Klassen-Restriktionen
      classes.ts          # 16 Klassen-Definitionen, Attribut-Anforderungen, Fähigkeiten
      combat.ts           # THAC0, Angriffswürfe, Rettungswürfe, Angriffe/Runde
      equipment.ts        # RK-Berechnung, Belastung, Bewegungsrate
      experience.ts       # XP-Tabellen, Stufen-Berechnung
      magic.ts            # Magie-Schulen, Priester-Sphären, Spezialisten
      multiclass.ts       # THAC0/Saves-Optimierung, Regeltreue-Check, HP-Divisor
      proficiencies.ts    # Waffen-/NWP-Slots, Spezialisierung, Abzüge
      races.ts            # 7 Rassen, Attribut-Adj., Level-Limits, Infravision
      spellslots.ts       # Wizard Slots, Priest Slots/Bonus, Spell Points, canLearnSpell
      thief.ts            # Diebesfähigkeiten, Rassen-Adj., Backstab-Multiplikator
      types.ts            # Zentrale Typdefinitionen
      index.ts            # Barrel-Export
    supabase/             # Supabase Client-Helfer (client.ts, server.ts, middleware.ts)
    utils/                # Hilfsfunktionen (cn, units: lbsToKg, feetToMeters)
  middleware.ts           # Next.js Middleware (Supabase Session-Refresh)
  test/                   # Vitest Setup, Smoke- & Regressionstests
e2e/                      # Playwright E2E-Tests
  pages/                  # Page Object Models (character-sheet, spellbook, login)
  helpers/                # Auth-Helper (Cookie-basierter Test-Login)
messages/                 # i18n-Dateien (de.json, en.json)
supabase/
  migrations/             # SQL-Migrationen (Supabase Schema + Seed-Daten)
```

## Regelwerk-Engine (`src/lib/rules/`)

Die AD&D-Regeln sind als **reine TypeScript-Funktionen** implementiert (kein DB-Zugriff, kein Framework). Stammdaten (Rassen, Klassen, Waffen, Rüstungen, Zauber) liegen zusätzlich in Supabase.

### Kernfunktionen

**Attribute:**

- `getStrengthModifiers(str, exceptional?)` — inkl. 18/xx Ausnahmestärke
- `getDexterityModifiers(dex)` / `getConstitutionModifiers(con)` / `getIntelligenceModifiers(int)` / `getWisdomModifiers(wis)` / `getCharismaModifiers(cha)`

**Klassen & Rassen:**

- `getClass(classId)` / `getAllClasses()` / `getClassGroup(classId)` / `meetsAbilityRequirements(classId, abilities)`
- `getRace(raceId)` / `getAllRaces()` / `canPlayClass(raceId, classId)` / `getLevelLimit(raceId, classId)`

**Kampf:**

- `getThac0(classGroup, level)` / `getAttackRoll(thac0, targetAC)` / `getSavingThrows(classGroup, level)` / `getAttacksPerRound(classGroup, level)`

**Magie:**

- `getWizardSpellSlots(level)` / `getPriestSpellSlots(level)` / `getPriestBonusSlots(wisScore)`
- `getPriestSpellPoints(level)` / `getPriestBonusSpellPoints(wis)` / `getPriestSpellCost(spellLevel)`
- `canLearnSpell(classId, school?, sphere?, level, intScore)` / `getOppositionSchools(classId)` / `hasSphereAccess(classId, sphere, level)`

**Multiclass:**

- `getMulticlassThac0(classes)` / `getMulticlassSaves(classes)` / `getMulticlassHpDivisor(count)` / `isRuleCompliantMulticlass(raceId, classIds)` / `multiclassHasExceptionalStr(classIds)`

**Fertigkeiten & Ausrüstung:**

- `getWeaponProficiencySlots(classGroup, level)` / `getNonweaponProficiencySlots(classGroup, level)` / `canSpecialize(classId)`
- `calculateAC(armorAC, shield, dexAdj)` / `calculateEncumbrance(weight, strAllow)` / `getMovementRate(base, encumbrance)`

**Dieb:**

- `getBaseThiefSkills(level)` / `getRacialThiefAdjustments(raceId)` / `getBackstabMultiplier(level)` / `hasThiefSkills(classIds)`

**Sonstiges:**

- `getAlignmentLabel(id)` / `getAllowedAlignments(classId)`
- `getXpForNextLevel(classId, level)` / `getXpThreshold(classId, level)`

### Regelwerk-Spezifikation (`src/lib/rules/spec/`)

`character-creation-rules.ts` katalogisiert alle PHB-Regeln zur Charaktererstellung mit eindeutigen IDs. Bei neuen Regel-Implementierungen:

1. Regel in der Spec von `missing` auf `implemented` setzen
2. `implementationFiles` und `implementationFunctions` eintragen
3. `testFiles` und `scenarios` pflegen
4. `coverage.test.ts` verifiziert automatisch die Abdeckung

**Regel-ID-Schema:**

- `ABILITY-xxx` — Attribut-Tabellen und -Generierung
- `RACE-xxx` — Rassen-Definitionen und -Tabellen
- `CLASS-xxx` — Klassen, HP, Dual-Class
- `ALIGN-xxx` — Gesinnungs-Regeln
- `PROF-xxx` — Fertigkeiten
- `EQUIP-xxx` — Ausrüstung und Gold
- `MAGIC-xxx` — Magie-System
- `XP-xxx` — Erfahrungspunkte
- `COMBAT-xxx` — Kampfwerte
- `MULTI-xxx` — Multiclass-Regeln
- `THIEF-xxx` — Diebes-Fertigkeiten

## Hausregeln

Diese Abweichungen vom Standard-PHB gelten für die "Chaos RPG"-Gruppe:

- **Multiclass/Dualclass:** Alle Rassen dürfen ohne Einschränkungen Multi-/Dualclass wählen. Die Engine zeigt nur **Warnungen**, blockiert aber nie.
- **Metrisches System:** Die DB speichert imperiale Werte (lbs, ft), die UI zeigt metrisch (kg, m) via `lbsToKg()`/`feetToMeters()`.
- **Priester-Zauberpunkte:** Statt des Standard-Slot-Systems nutzen wir das Player's Option Spell Points System.
- **Keine Restriktionen:** Klassen-/Rassen-Kombinationen, NWP-Gruppen etc. werden nie blockiert — immer nur Warnhinweise.

## Supabase

- **Client-Helfer:** `src/lib/supabase/client.ts` (Browser), `server.ts` (Server Components), `middleware.ts` (Session-Refresh)
- **Env-Variablen:** `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` (siehe `.env.local.example`)
- **RLS:** Alle Tabellen nutzen Row Level Security — SELECT für alle Authentifizierten, INSERT/UPDATE/DELETE nur für Owner

## AD&D 2e Regelwerk-Spezifika

Das Datenmodell und die Regelwerk-Engine müssen folgende AD&D 2e Besonderheiten korrekt abbilden:

- **Attribute:** STR (inkl. 18/xx Ausnahmestärke für Krieger), DEX, CON, INT, WIS, CHA
- **Kampfsystem:** Absteigende Rüstungsklasse (RK/AC), ETW0 (THAC0), klassenspezifische Trefferwürfel, Rettungswürfe
- **Rassen & Klassen:** Inklusive Level-Caps pro Rasse/Klasse-Kombination
- **Magie:** Magier nutzen Schulen (inkl. Spezialisten), Priester nutzen Sphären (Haupt-/Nebenzugang)
- **Fertigkeiten:** Waffenfertigkeiten (inkl. Spezialisierung) und Allgemeine Fertigkeiten
- **Ausrüstung:** Gewicht/Belastung und Waffengeschwindigkeit sind relevant

## Entwicklungs-Workflow (zwingend)

Für jedes neue Feature wird **immer ein neuer Branch** angelegt. Die Entwicklung durchläuft zwingend diese 4 Phasen in Reihenfolge:

### Phase 1: Requirements Engineering

Analysiere Anforderungen, sammle offene Fragen und Edge Cases, generiere Lösungsvorschläge mit Empfehlung. Betrachte auch immer die UI und UX in den Anforderungen! Versetze dich dazu in die Personas die die App nutzen werden. **Warte auf Freigabe durch den User, bevor Code geschrieben wird.**

### Phase 2: Implementierung

- Strikt nach **Test-Driven Development (TDD)** und **Clean Code**
- Tests gemäß Testpyramide: Unit > Integration > E2E
- Explorative Tests via `playwright-cli` durchführen; für jeden gefundenen Bug erst einen fehlschlagenden Test schreiben, dann beheben

### Phase 3: Code Review

Eigenen Code kritisch prüfen (Architektur, Lesbarkeit, Performance). Mängel beheben, bevor Phase 4 beginnt.

### Phase 4: Qualitätssicherung

Finaler explorativer Test mit etablierten Testing-Heuristiken und gezielten "Testing Touren".

## Roadmap-Überblick

1. **Projekt-Setup & Infrastruktur** — Repo, CI/CD, DB-Anbindung, Basis-Layout
2. **AD&D Core-Regelwerk (Engine)** — Attribute, RK/THAC0, Magie, Seeding
3. **Charakter-Management** — Charakterbogen, Erstellungs-Wizard (level-agnostisch), Avatar-Upload, Print-Layout
4. **Die Chronik des Chaos (Session Log)** — Timeline, Tagging, Smart Summaries
5. **Advanced Features** — OCR/Vision-Import, Spielleiter-Dashboard
