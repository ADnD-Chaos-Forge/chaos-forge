# Chaos Forge

Ein webbasierter Charakter-Manager und Session-Tracker für Advanced Dungeons & Dragons (AD&D) 2nd Edition, maßgeschneidert für die Rollenspielgruppe "Chaos RPG".

## Über das Projekt

Chaos Forge ersetzt umständliche Offline-Editoren aus den 90er Jahren durch eine moderne, mobile-freundliche Web-App. Der Fokus liegt auf Usability, strikter Einhaltung der komplexen 2e-Regeln, einer optimierten Druckausgabe für das Spielen am Tisch und einem innovativen Session-Log ("Die Chronik des Chaos").

## Features

- **Charakterbogen** — Vollständige Abbildung eines AD&D 2e Charakterbogens mit Attributen, Kampfwerten, Ausrüstung, Zaubern, Fertigkeiten und Diebesfähigkeiten
- **Multiclass & Dualclass** — Mehrklassen-System mit Junction-Table, THAC0/Rettungswurf-Optimierung
- **Zauberbuch** — Eigenständige Gameplay-Seite zum Verwalten, Vorbereiten und Lernen von Zaubern (Wizard Slots + Priest Spell Points)
- **Druckansicht** — Optimiertes Print-Layout für den Spieltisch
- **i18n** — Vollständige Lokalisierung Deutsch/Englisch (Cookie-basiert via next-intl)
- **Regelwerk-Engine** — Reine TypeScript-Funktionen für alle PHB-Regeln (Attribute, Klassen, Rassen, Magie, Kampf, Fertigkeiten)
- **Read-Only Modus** — Mitspieler können Charaktere anderer Spieler einsehen, aber nicht bearbeiten

## Tech-Stack

- **Frontend/Backend:** Next.js 16 (App Router, TypeScript)
- **Datenbank & Auth:** Supabase (PostgreSQL + Row Level Security)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **i18n:** next-intl (Cookie-basiert, DE/EN)
- **Testing:** Vitest (Unit), Playwright (E2E)
- **Hosting:** Vercel (Free-Tier optimiert)

## Lokale Entwicklung

1. **Repository klonen**

   ```bash
   git clone https://github.com/ADnD-Chaos-Forge/chaos-forge.git
   cd chaos-forge
   ```

2. **Dependencies installieren**

   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**

   ```bash
   cp .env.local.example .env.local
   # Supabase-URL und Anon-Key eintragen
   ```

4. **Dev-Server starten**

   ```bash
   npm run dev
   ```

5. **Tests ausführen**
   ```bash
   npm test              # Unit-Tests (Vitest)
   npm run test:e2e      # E2E-Tests (Playwright)
   ```

## Regelwerk-Spezifikation

Die Datei `src/lib/rules/spec/character-creation-rules.ts` katalogisiert alle AD&D 2e Charaktererstellungs-Regeln aus dem Player's Handbook mit eindeutigen IDs.

- Jede Regel hat eine ID (z.B. `ABILITY-001`, `RACE-003`, `COMBAT-002`)
- Jede Regel referenziert Implementierungs-Dateien, Funktionen und Test-Dateien
- `npm test` verifiziert automatisch, dass alle implementierten Regeln Tests haben

### Regelabdeckung

| Kategorie     | Implementiert | Partiell | Fehlend | Gesamt |
| ------------- | ------------- | -------- | ------- | ------ |
| Attribute     | 13            | 1        | 0       | 14     |
| Rassen        | 15            | 0        | 0       | 15     |
| Klassen       | 10            | 3        | 0       | 13     |
| Gesinnung     | 6             | 0        | 0       | 6      |
| Fertigkeiten  | 5             | 0        | 0       | 5      |
| Ausrüstung    | 4             | 0        | 0       | 4      |
| Magie         | 11            | 1        | 0       | 12     |
| Erfahrung     | 3             | 0        | 0       | 3      |
| Kampf         | 4             | 0        | 0       | 4      |
| Multiclass    | 5             | 0        | 0       | 5      |
| Diebesfähigk. | 4             | 0        | 0       | 4      |
| **Gesamt**    | **80**        | **5**    | **0**   | **85** |

## Projektstruktur

```
src/
  app/                    # Next.js App Router (Pages, Layouts)
    characters/[id]/      # Charakterbogen, Druckansicht, Zauberbuch
  components/
    character-sheet/      # Tabs: Stats, Combat, Equipment, Spells, Proficiencies, Thief Skills
    spellbook/            # Standalone Spellbook-Seite
    print-sheet/          # Druckansicht
    ui/                   # shadcn/ui Komponenten
  lib/
    rules/                # AD&D 2e Regelwerk-Engine (reine TypeScript-Logik)
      spec/               # Regelwerk-Spezifikation + Coverage-Test
    supabase/             # Supabase Client-Helfer
    utils/                # Hilfsfunktionen (cn, units)
  test/                   # Vitest Setup & Regressionstests
e2e/                      # Playwright E2E-Tests (POM-Pattern)
  pages/                  # Page Object Models
  helpers/                # Auth-Helper
messages/                 # i18n-Dateien (de.json, en.json)
supabase/
  migrations/             # SQL-Migrationen
```
