import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import ChatView from '../components/ChatView';
import { INTENT_LABELS, STATUS_CONFIG, TARIF_CONFIG } from '../components/TicketCard';

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function timeStr(ts) {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function Sparkline({ values }) {
  if (!values || values.length < 2) return <span className="sparkline-empty">Warte auf Daten…</span>;
  const W = 140, H = 36;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W;
    const y = H - (v / 100) * (H - 4) - 2;
    return `${x},${y}`;
  });
  const last = values[values.length - 1];
  const color = last >= 85 ? 'var(--green)' : last >= 70 ? '#f59e0b' : 'var(--red)';
  return (
    <svg width={W} height={H} style={{ overflow: 'visible' }}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" />
      {values.map((v, i) => {
        const x = (i / (values.length - 1)) * W;
        const y = H - (v / 100) * (H - 4) - 2;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
}

function TimelineItem({ icon, text, time, sub }) {
  return (
    <div className="timeline-item">
      <span className="timeline-icon">{icon}</span>
      <div className="timeline-body">
        <div className="timeline-text">{text}</div>
        {sub && <div className="timeline-sub">{sub}</div>}
      </div>
      <span className="timeline-time">{time}</span>
    </div>
  );
}

function buildTimeline(ticket) {
  const items = [];
  items.push({ icon: '🔵', text: 'Ticket erstellt', time: timeStr(ticket.createdAt), sub: null });

  let msgIndex = 0;
  for (const msg of ticket.messages) {
    if (msg.role === 'kai') {
      const intent = INTENT_LABELS[msg.intent_category];
      items.push({
        icon: '🤖',
        text: `Kai antwortet (${msg.confidence}%)`,
        time: timeStr(msg.timestamp),
        sub: intent ? intent.label : null,
      });
    } else if (msg.role === 'customer') {
      msgIndex++;
      if (msgIndex > 1) {
        items.push({ icon: '🔵', text: 'Kundenantwort', time: timeStr(msg.timestamp), sub: null });
      }
    } else if (msg.role === 'agent') {
      items.push({ icon: '👤', text: 'Agent antwortet', time: timeStr(msg.timestamp), sub: null });
    }
  }

  if (ticket.status === 'escalated') {
    items.push({ icon: '⚡', text: 'Eskaliert', time: timeStr(Date.now()), sub: 'Manuelles Eingreifen erforderlich' });
  } else if (ticket.status === 'resolved') {
    items.push({ icon: '✅', text: 'Von KI gelöst', time: timeStr(Date.now()), sub: `${ticket.finalConfidence}% Konfidenz` });
  } else if (ticket.status === 'human') {
    items.push({ icon: '👤', text: 'Agent übernommen', time: timeStr(Date.now()), sub: null });
  }

  return items;
}

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticket = useStore(s => s.tickets.find(t => t.id === id));

  if (!ticket) {
    return (
      <div className="page">
        <div className="not-found">
          <p>Ticket nicht gefunden.</p>
          <button className="btn-back" onClick={() => navigate('/queue')}>← Zurück zur Queue</button>
        </div>
      </div>
    );
  }

  const { customer, status, confidenceHistory, intent_category, messages } = ticket;
  const intent = INTENT_LABELS[intent_category] || null;
  const statusConf = STATUS_CONFIG[status];
  const tarifConf = TARIF_CONFIG[customer.tarif] || TARIF_CONFIG.Plus;
  const eSIM = customer.tarif === 'Pro' || customer.tarif === 'Unlimited';
  const timeline = buildTimeline(ticket);

  const tariffPrices = { Basic: '14,99 €', Plus: '24,99 €', Pro: '34,99 €', Unlimited: '44,99 €' };

  return (
    <div className="page ticket-detail-page">
      <div className="ticket-detail-back">
        <button className="btn-back" onClick={() => navigate('/queue')}>← Queue</button>
      </div>

      <div className="ticket-detail-layout">
        <div className="ticket-detail-chat">
          <ChatView ticket={ticket} />
        </div>

        <aside className="ticket-detail-sidebar">
          <div className="profile-card card">
            <div className="profile-avatar" style={{ background: customer.avatarColor }}>
              {getInitials(customer.name)}
            </div>
            <h3 className="profile-name">{customer.name}</h3>
            <p className="profile-sub">#{customer.kundennummer} · Kunde seit {customer.kundeseit}</p>

            <div className="profile-tarif-card">
              <div className="profile-tarif-row">
                <span className="profile-tarif-label">Aktueller Tarif</span>
                <span className="ticket-badge" style={{ color: tarifConf.color, background: tarifConf.bg, fontSize: 13 }}>
                  O1 {customer.tarif}
                </span>
              </div>
              <div className="profile-tarif-row">
                <span className="profile-tarif-label">Monatlich</span>
                <span className="profile-tarif-value">{tariffPrices[customer.tarif] || '—'}</span>
              </div>
              <div className="profile-tarif-row">
                <span className="profile-tarif-label">eSIM</span>
                <span style={{ color: eSIM ? 'var(--green)' : 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>
                  {eSIM ? '✓ Ja' : '✗ Nein'}
                </span>
              </div>
            </div>

            {statusConf && (
              <div className="profile-status-row">
                <span className="profile-status-pill" style={{ color: statusConf.color, background: statusConf.bg }}>
                  {statusConf.label}
                </span>
                {intent && (
                  <span className="ticket-badge" style={{ color: intent.color, background: intent.bg }}>
                    {intent.label}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="sparkline-card card">
            <h4 className="sparkline-title">Konfidenz-Verlauf</h4>
            <div className="sparkline-wrap">
              <Sparkline values={confidenceHistory} />
            </div>
            {confidenceHistory.length > 0 && (
              <p className="sparkline-last">
                Zuletzt: <strong>{confidenceHistory[confidenceHistory.length - 1]}%</strong>
              </p>
            )}
          </div>

          <div className="timeline-card card">
            <h4 className="timeline-title">Ticket-Timeline</h4>
            <div className="timeline-list">
              {timeline.map((item, i) => (
                <TimelineItem key={i} {...item} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
