# 🗺️ Chaos Forge - Entwicklungs-Roadmap

## 1. Projektübersicht

Entwicklung von "Chaos Forge", einer modernen Web-Applikation zur Erstellung, Verwaltung und Aktualisierung von Pen-&-Paper-Charakteren für **Advanced Dungeons & Dragons (AD&D) 2nd Edition**.
Die App richtet sich an eine private Spielgruppe ("Chaos RPG") mit maximal 10 Nutzern und sehr geringer paralleler Nutzung.
**Wichtigstes Architekturziel:** Die Applikation muss extrem kostengünstig (idealerweise komplett im Free-Tier) zu betreiben und zu hosten sein.

## 2. Kernfunktionen (Features)

- **Level-Agnostische Erstellung:** Charaktere können auf beliebigen Stufen angelegt werden.
- **Avatar-Upload:** Möglichkeit, Charakterporträts hochzuladen.
- **Smart Print-Layout:** Generierung eines perfekt optimierten, druckfertigen PDFs für das Spielen am Tisch ohne Bildschirme.
- **Foto-Import (OCR/Vision):** Auslesen und Importieren von physischen Charakterbögen via Kamera/Foto.
- **Session-Management ("Die Chronik des Chaos"):** Timeline-Ansicht, Tagging und Smart Summaries (Zusammenfassungen für längere Spielpausen).
- **Geführter Wizard & Automatisierung:** Anfängerfreundliche Erstellung unter strikter Einhaltung der AD&D 2e Restriktionen (inkl. automatischer Modifikatoren-Berechnung).

## 3. AD&D 2nd Edition Spezifika (Datenmodell)

- **Attribute:** STR (inkl. 18/xx Ausnahmsstärke), DEX, CON, INT, WIS, CHA.
- **Rassen & Klassen:** Mensch, Elf, Zwerg etc. vs. Krieger, Magier, Priester, Schurken (inkl. Level-Caps).
- **Kampfwerte:** Absteigende Rüstungsklasse (RK/AC), ETW0 (THAC0), klassenspezifische Trefferwürfel, Rettungswürfe.
- **Fertigkeiten:** Waffenfertigkeiten (inkl. Spezialisierung) und Allgemeine Fertigkeiten.
- **Magie:** Magier (Schulen & Spezialisten) und Priester (Sphären mit Haupt-/Nebenzugang).
- **Ausrüstung:** Berücksichtigung von Gewicht (Belastung) und Waffengeschwindigkeit.

## Epic 1: Projekt-Setup & Infrastruktur

- [x] Initialisierung des Repositories & Tech-Stacks (Next.js 16, TypeScript, Tailwind v4, shadcn/ui).
- [x] Setup der CI/CD Pipeline (GitHub Actions) und Playwright für E2E-Testing.
- [x] Anbindung der Datenbank (Supabase) & Einrichtung des Datenmodells (profiles, characters + RLS).
- [x] Basis-Layout und Theming (AD&D Nostalgie-Look: Cinzel + Crimson Text, dunkles Pergament-Theme).

## Epic 2: AD&D Core-Regelwerk (Engine)

- [ ] Datenstruktur für Attribute (inkl. 18/xx Stärke), Rassen und Klassen.
- [ ] Logik für absteigende Rüstungsklasse (RK) und ETW0 (THAC0).
- [ ] Implementierung des Magiesystems (Schulen für Magier, Sphären für Priester).
- [ ] Datenbank-Seeding mit grundlegenden Waffen, Rüstungen und Zaubern.

## Epic 3: Charakter-Management

- [ ] Interaktiver Charakterbogen (Anzeige & manuelle Bearbeitung).
- [ ] Step-by-Step Wizard für die Charaktererstellung (level-agnostisch).
- [ ] Avatar-Upload-Funktion.
- [ ] Smart Print-Layout (Druck-CSS/PDF-Generierung).

## Epic 4: Die Chronik des Chaos (Session Log)

- [ ] Timeline-Ansicht für Sessions.
- [ ] Tagging-System (NPCs, Orte, Charaktere).
- [ ] Smart Summaries (Text-Zusammenfassungen).

## Epic 5: Advanced Features

- [ ] OCR/Vision-Import zum Scannen alter Charakterbögen.
- [ ] Gruppen-Dashboard für den Spielleiter.
