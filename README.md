# Chaos Forge

Ein webbasierter Charakter-Manager und Session-Tracker für Advanced Dungeons & Dragons (AD&D) 2nd Edition, maßgeschneidert für die Rollenspielgruppe "Chaos RPG".

## Über das Projekt

Chaos Forge ersetzt umständliche Offline-Editoren aus den 90er Jahren durch eine moderne, mobile-freundliche Web-App. Der Fokus liegt auf Usability, strikter Einhaltung der komplexen 2e-Regeln, einer optimierten Druckausgabe für das Spielen am Tisch und einem innovativen Session-Log ("Die Chronik des Chaos").

## Tech-Stack

- **Frontend/Backend:** Next.js 16 (App Router, TypeScript)
- **Datenbank & Auth:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS v4 + shadcn/ui
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
   npm test              # Unit-Tests
   npm run test:e2e      # E2E-Tests (Playwright)
   ```
