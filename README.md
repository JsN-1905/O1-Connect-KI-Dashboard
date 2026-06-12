# O1 Connect — Agent Dashboard

Interaktiver Prototyp für die IT-Consulting Fallstudie der Hochschule München.
Simuliert ein Zendesk-artiges Support-Dashboard mit dem KI-Assistenten **Kai**.

**Vollständig client-seitig — kein Backend, kein API-Key erforderlich.**

---

## Was die App macht

- **Live Ticket-Simulation**: Alle 18–40 Sekunden generiert ein Simulator neue Kundentickets
- **Kai KI-Assistent**: Lokal simuliertes KI-Gehirn (Keyword-Scoring, keine externe API)
- **Echtzeit-Chat**: Spectator-Ansicht laufender Kai-Gespräche mit Typing-Indikatoren
- **Eskalations-Toasts**: Orange Toast-Benachrichtigungen bei Kündigung/Beschwerden
- **"Gespräch übernehmen"**: Agent kann eskalierte Tickets selbst weiterführen
- **Dashboard KPIs**: Deflection Rate, Konfidenz, Eskalationsrate, offene Tickets
- **Vor/Nach-Vergleich**: IST-Zustand vs. Pilot- und Rollout-Ziele

---

## Lokales Setup

```bash
git clone <dein-repo>
cd o1-connect-dashboard
npm install
npm run dev
```

Öffne `http://localhost:5173` im Browser.

---

## Deployment auf GitHub Pages

1. **GitHub Repository erstellen** (z.B. `o1-connect-dashboard`)

2. **`package.json` anpassen** — ersetze den Platzhalter mit deinem GitHub-Username:
   ```json
   "homepage": "https://DEIN-GITHUB-USERNAME.github.io/o1-connect-dashboard"
   ```

3. **Code pushen und deployen**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/DEIN-USERNAME/o1-connect-dashboard.git
   git push -u origin main
   npm run deploy
   ```

4. **GitHub Pages aktivieren**:
   - Repository → Settings → Pages
   - Source: **Deploy from a branch**
   - Branch: `gh-pages` → `/root` → Save

5. Nach ca. 1–2 Minuten erreichbar unter:
   `https://DEIN-GITHUB-USERNAME.github.io/o1-connect-dashboard`

---

## Projektstruktur

```
src/
├── components/       # Sidebar, ChatView, TicketCard, KPICard, ...
├── pages/            # Dashboard, Queue, TicketDetail
├── store/            # Zustand Global State
├── data/             # Kundendaten & Chat-Szenarien (statisch)
└── utils/
    ├── kai.js        # Simuliertes KI-Gehirn (Keyword-Scoring, kein API-Key)
    └── simulator.js  # Auto-Ticket-Generator (alle 18–40 Sekunden)
```
