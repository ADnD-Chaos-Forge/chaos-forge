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

- [x] Datenstruktur für Attribute (inkl. 18/xx Stärke), 7 Rassen und 16 Klassen.
- [x] Logik für absteigende Rüstungsklasse (RK) und ETW0 (THAC0) + Rettungswürfe.
- [x] Implementierung des Magiesystems (8 Schulen für Magier, 16 Sphären für Priester).
- [x] Datenbank-Seeding mit 12 Rüstungen, 16 Waffen und 18 Beispielzaubern.
- [x] Logos (WebP) und Favicons aus Ressources ins Design eingebaut.

## Epic 3: Charakter-Management

- [x] Interaktiver Charakterbogen (Anzeige & manuelle Bearbeitung) mit Tabs (Werte/Kampf/Notizen).
- [x] Step-by-Step Wizard für die Charaktererstellung (6 Schritte, level-agnostisch).
- [x] Avatar-Upload (Client-seitiges Resize 400x400 WebP, Supabase Storage, Initialen-Fallback).
- [x] Smart Print-Layout (Druck-CSS, dedizierter Print-View /characters/[id]/print, A4-optimiert).

## Epic 4: Die Chronik des Chaos (Session Log)

- [ ] Timeline-Ansicht für Sessions.
- [ ] Tagging-System (NPCs, Orte, Charaktere).
- [ ] Smart Summaries (Text-Zusammenfassungen).

## Epic 5: Advanced Features

- [ ] OCR/Vision-Import zum Scannen alter Charakterbögen.
- [ ] Gruppen-Dashboard für den Spielleiter.
