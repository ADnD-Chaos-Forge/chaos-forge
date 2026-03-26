# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projektübersicht

**Chaos Forge** ist ein webbasierter Charakter-Manager und Session-Tracker für AD&D 2nd Edition, gebaut für die private Spielgruppe "Chaos RPG" (max. 10 Nutzer, sehr geringe parallele Nutzung).

**Oberstes Architekturziel:** Komplett im Free-Tier betreibbar (Hosting, Datenbank, Auth).

## Tech-Stack

- **Frontend/Backend:** Next.js (oder SvelteKit — noch zu entscheiden)
- **Datenbank & Auth:** Supabase (oder Firebase — noch zu entscheiden)
- **E2E-Testing:** Playwright
- **Unit-Testing:** Vitest (oder äquivalent — noch zu entscheiden)
- **Hosting:** Vercel/Netlify (Free-Tier)
- **UI-Theme:** AD&D-Nostalgie-Look (Serifen, Texturen, Mobile-Friendly)

> **Hinweis:** Der Tech-Stack ist noch nicht finalisiert. Sobald das Projekt initialisiert ist, sollte dieser Abschnitt mit konkreten Build-/Test-/Lint-Befehlen aktualisiert werden.

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
