import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import KPICard from '../components/KPICard';
import ConfidenceMeter from '../components/ConfidenceMeter';
import { INTENT_LABELS, STATUS_CONFIG, TARIF_CONFIG } from '../components/TicketCard';

const COMPARE_ROWS = [
  { label: 'KI-Deflection',        ist: '0 %',      pilot: '≥ 40 %',   rollout: '≥ 65 %',   status: 'Pilot läuft',    statusType: 'warn' },
  { label: 'Kosten / Anfrage',      ist: '12,00 €',  pilot: '7,00 €',   rollout: '4,50 €',   status: 'Pilot läuft',    statusType: 'warn' },
  { label: 'Ø Wartezeit',           ist: '8 Min.',   pilot: '3 Min.',   rollout: '< 1 Min.',  status: 'Pilot läuft',    statusType: 'warn' },
  { label: 'CSAT',                  ist: '78 %',     pilot: '83 %',     rollout: '88 %',      status: 'Pilot läuft',    statusType: 'warn' },
  { label: 'First Call Resolution', ist: '62 %',     pilot: '74 %',     rollout: '83 %',      status: 'Pilot läuft',    statusType: 'warn' },
  { label: 'Erreichbarkeit',        ist: '8h / Tag', pilot: '24 / 7',   rollout: '24 / 7',    status: 'Erreicht',       statusType: 'good' },
  { label: 'Amortisation',         ist: '—',        pilot: '14 Monate', rollout: '8 Monate', status: 'In Berechnung', statusType: 'info' },
];

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `vor ${diff}s`;
  if (diff < 3600) return `vor ${Math.floor(diff / 60)} Min.`;
  return `vor ${Math.floor(diff / 3600)} Std.`;
}

function ActivityDot({ type }) {
  const colors = { new: 'var(--blue)', resolved: 'var(--green)', escalated: 'var(--orange)' };
  return <span className="activity-dot" style={{ background: colors[type] || 'var(--blue)' }} />;
}

function Sparkline({ values }) {
  if (!values || values.length < 2) return <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>;
  const W = 80, H = 28;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W;
    const y = H - (v / 100) * H;
    return `${x},${y}`;
  });
  return (
    <svg width={W} height={H}>
      <polyline points={pts.join(' ')} fill="none" stroke="var(--blue)" strokeWidth="2" />
    </svg>
  );
}

export default function Dashboard() {
  const kpis = useStore(s => s.kpis);
  const tickets = useStore(s => s.tickets);
  const activityFeed = useStore(s => s.activityFeed);
  const navigate = useNavigate();

  const deflectionRate = kpis.total > 0 ? Math.round((kpis.deflected / kpis.total) * 100) : 0;
  const escalationRate = kpis.total > 0 ? Math.round((kpis.escalated / kpis.total) * 100) : 0;
  const openTickets = tickets.filter(t => t.status === 'active').length;
  const recentActive = tickets.filter(t => t.status === 'active').slice(0, 3);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">O1 Connect GmbH — Kai KI-Pilot Echtzeit-Übersicht</p>
      </div>

      <div className="kpi-grid">
        <KPICard
          title="Deflection Rate"
          value={deflectionRate}
          unit="%"
          target={40}
          targetLabel="> 40%"
          type="deflection"
          icon="🎯"
        />
        <KPICard
          title="Ø Konfidenz (Kai)"
          value={kpis.avgConfidence}
          unit="%"
          target={80}
          targetLabel="> 80%"
          type="confidence"
          icon="🧠"
        />
        <KPICard
          title="Eskalationsrate"
          value={escalationRate}
          unit="%"
          target={20}
          targetLabel="< 20%"
          type="escalation"
          icon="⚡"
        />
        <KPICard
          title="Offene Tickets"
          value={openTickets}
          unit=""
          target={0}
          trend={openTickets}
          icon="📋"
        />
      </div>

      <div className="dashboard-mid">
        <div className="activity-feed card">
          <div className="card-header">
            <h2 className="card-title">Live Activity Feed</h2>
            <span className="live-indicator">● LIVE</span>
          </div>
          <div className="activity-list">
            {activityFeed.length === 0 && (
              <p className="empty-state">Warte auf erste Aktivität…</p>
            )}
            {activityFeed.map(item => (
              <div key={item.id} className="activity-item">
                <ActivityDot type={item.type} />
                <span className="activity-text">{item.text}</span>
                <span className="activity-time">{timeAgo(item.time)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-tickets card">
          <div className="card-header">
            <h2 className="card-title">Aktive Tickets</h2>
            <button className="card-link" onClick={() => navigate('/queue')}>Alle →</button>
          </div>
          {recentActive.length === 0 ? (
            <p className="empty-state">Keine aktiven Tickets</p>
          ) : (
            <div className="recent-list">
              {recentActive.map(t => {
                const lastKai = [...t.messages].reverse().find(m => m.role === 'kai');
                const conf = lastKai?.confidence || 0;
                const intent = INTENT_LABELS[t.intent_category] || null;
                const tarifConf = TARIF_CONFIG[t.customer.tarif] || TARIF_CONFIG.Plus;
                return (
                  <div key={t.id} className="recent-ticket-card" onClick={() => navigate(`/ticket/${t.id}`)}>
                    <div className="recent-ticket-top">
                      <div className="ticket-avatar-sm" style={{ background: t.customer.avatarColor }}>
                        {getInitials(t.customer.name)}
                      </div>
                      <div className="recent-ticket-info">
                        <span className="recent-ticket-name">{t.customer.name}</span>
                        <span className="ticket-badge" style={{ color: tarifConf.color, background: tarifConf.bg }}>
                          {t.customer.tarif}
                        </span>
                        {intent && (
                          <span className="ticket-badge" style={{ color: intent.color, background: intent.bg }}>
                            {intent.label}
                          </span>
                        )}
                      </div>
                      <ConfidenceMeter value={conf} size={40} />
                    </div>
                    {conf > 0 && (
                      <div className="recent-conf-bar">
                        <div className="conf-bar-track">
                          <div
                            className="conf-bar-fill"
                            style={{
                              width: `${conf}%`,
                              background: conf >= 85 ? 'var(--green)' : conf >= 70 ? '#f59e0b' : 'var(--red)',
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="compare-section card">
        <div className="card-header">
          <h2 className="card-title">Vor / Nach Vergleich — Kai KI-Pilot</h2>
          <span className="compare-sub">O1 Connect GmbH · 1,2 Mio. Anfragen / Jahr · 12 €/Anfrage IST</span>
        </div>
        <table className="compare-table">
          <thead>
            <tr>
              <th>Kennzahl</th>
              <th>IST-Zustand</th>
              <th>Pilot-Ziel</th>
              <th>Rollout-Ziel</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map(row => (
              <tr key={row.label}>
                <td className="compare-label">{row.label}</td>
                <td className="compare-ist">{row.ist}</td>
                <td className="compare-pilot">{row.pilot}</td>
                <td className="compare-rollout">{row.rollout}</td>
                <td>
                  <span className={`compare-badge compare-badge-${row.statusType}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
