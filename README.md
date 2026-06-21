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

## Link zum Prototypen

Der Prototyp lässt sich unter folgendem Link aufrufen: https://jsn-1905.github.io/O1-Connect-KI-Dashboard/

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
