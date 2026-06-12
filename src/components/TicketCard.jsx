import { useNavigate } from 'react-router-dom';
import ConfidenceMeter from './ConfidenceMeter';

export const INTENT_LABELS = {
  TARIFF_QUERY:    { label: 'Tarifanfrage',        color: '#2563eb', bg: '#eff6ff' },
  BILLING_QUERY:   { label: 'Rechnungsfrage',       color: '#ea580c', bg: '#fff7ed' },
  DATA_VOLUME:     { label: 'Datenvolumen',          color: '#0891b2', bg: '#ecfeff' },
  ROAMING:         { label: 'Roaming',               color: '#7c3aed', bg: '#f5f3ff' },
  DEVICE_COMPAT:   { label: 'Gerätekompatibilität', color: '#059669', bg: '#ecfdf5' },
  STATUS_QUERY:    { label: 'Auftragsstatus',        color: '#6b7280', bg: '#f3f4f6' },
  CANCELLATION:    { label: 'Kündigung',             color: '#dc2626', bg: '#fef2f2' },
  COMPLAINT:       { label: 'Beschwerde',            color: '#dc2626', bg: '#fef2f2' },
  CONTRACT_CHANGE: { label: 'Vertragsänderung',      color: '#ea580c', bg: '#fff7ed' },
  FALLBACK:        { label: 'Unklar',                color: '#9ca3af', bg: '#f9fafb' },
};

export const STATUS_CONFIG = {
  active:    { label: 'KI Aktiv',    color: '#2563eb', bg: '#eff6ff' },
  escalated: { label: 'Eskaliert',   color: '#ea580c', bg: '#fff7ed' },
  resolved:  { label: 'Gelöst',      color: '#059669', bg: '#ecfdf5' },
  human:     { label: 'Übernommen',  color: '#7c3aed', bg: '#f5f3ff' },
};

export const TARIF_CONFIG = {
  Basic:     { color: '#6b7280', bg: '#f3f4f6' },
  Plus:      { color: '#2563eb', bg: '#eff6ff' },
  Pro:       { color: '#7c3aed', bg: '#f5f3ff' },
  Unlimited: { color: '#059669', bg: '#ecfdf5' },
};

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `vor ${diff}s`;
  if (diff < 3600) return `vor ${Math.floor(diff / 60)} Min.`;
  return `vor ${Math.floor(diff / 3600)} Std.`;
}

export default function TicketCard({ ticket }) {
  const navigate = useNavigate();
  const { customer, status, messages, intent_category, createdAt } = ticket;

  const firstMsg = messages.find(m => m.role === 'customer');
  const lastKai = [...messages].reverse().find(m => m.role === 'kai');
  const confidence = lastKai?.confidence || 0;
  const intent = INTENT_LABELS[intent_category] || INTENT_LABELS.FALLBACK;
  const statusConf = STATUS_CONFIG[status] || STATUS_CONFIG.active;
  const tarifConf = TARIF_CONFIG[customer.tarif] || TARIF_CONFIG.Plus;

  return (
    <div className="ticket-card" onClick={() => navigate(`/ticket/${ticket.id}`)}>
      <div className="ticket-card-left">
        <div className="ticket-avatar" style={{ background: customer.avatarColor }}>
          {getInitials(customer.name)}
        </div>
        <div className="ticket-card-info">
          <div className="ticket-card-name-row">
            <span className="ticket-card-name">{customer.name}</span>
            <span className="ticket-badge" style={{ color: tarifConf.color, background: tarifConf.bg }}>
              {customer.tarif}
            </span>
            {intent_category && (
              <span className="ticket-badge" style={{ color: intent.color, background: intent.bg }}>
                {intent.label}
              </span>
            )}
          </div>
          {firstMsg && (
            <p className="ticket-card-preview">{firstMsg.message.slice(0, 80)}{firstMsg.message.length > 80 ? '…' : ''}</p>
          )}
          <div className="ticket-card-meta">
            <span className="ticket-time">{timeAgo(createdAt)}</span>
            {lastKai && <span className="ticket-conf-label">{confidence}% Konfidenz</span>}
          </div>
        </div>
      </div>
      <div className="ticket-card-right">
        {lastKai ? (
          <ConfidenceMeter value={confidence} size={44} />
        ) : (
          <div className="ticket-meter-placeholder" />
        )}
        <span className="ticket-status-pill" style={{ color: statusConf.color, background: statusConf.bg }}>
          {statusConf.label}
        </span>
      </div>
    </div>
  );
}
