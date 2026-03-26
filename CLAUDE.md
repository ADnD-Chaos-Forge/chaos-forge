# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projektübersicht

**Chaos Forge** ist ein webbasierter Charakter-Manager und Session-Tracker für AD&D 2nd Edition, gebaut für die private Spielgruppe "Chaos RPG" (max. 10 Nutzer, sehr geringe parallele Nutzung).

**Oberstes Architekturziel:** Komplett im Free-Tier betreibbar (Hosting, Datenbank, Auth).

## Tech-Stack

- **Framework:** Next.js 16 (App Router) mit TypeScript
- **Datenbank & Auth:** Supabase (PostgreSQL + Row Level Security)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Unit-/Integrationstests:** Vitest + React Testing Library
- **E2E-Tests:** Playwright (Chromium)
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
  app/              # Next.js App Router (Pages, Layouts)
  components/ui/    # shadcn/ui Komponenten
  lib/
    supabase/       # Supabase Client-Helfer (client.ts, server.ts, middleware.ts)
    utils.ts        # Utility-Funktionen (cn helper)
  middleware.ts     # Next.js Middleware (Supabase Session-Refresh)
  test/             # Vitest Setup & Smoke-Tests
e2e/                # Playwright E2E-Tests
supabase/
  migrations/       # SQL-Migrationen (Supabase Schema)
```

## Supabase

- **Client-Helfer:** `src/lib/supabase/client.ts` (Browser), `server.ts` (Server Components), `middleware.ts` (Session-Refresh)
- **Env-Variablen:** `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` (siehe `.env.local.example`)
- **RLS:** Alle Tabellen nutzen Row Level Security — User sehen nur ihre eigenen Daten

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

Analysiere Anforderungen, sammle offene Fragen und Edge Cases, generiere Lösungsvorschläge mit Empfehlung. **Warte auf Freigabe durch den User, bevor Code geschrieben wird.**

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
