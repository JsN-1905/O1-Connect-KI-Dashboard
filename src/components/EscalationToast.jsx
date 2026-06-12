import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { INTENT_LABELS } from './TicketCard';

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function Toast({ notif, onDismiss }) {
  const navigate = useNavigate();
  const intent = INTENT_LABELS[notif.intent_category] || INTENT_LABELS.FALLBACK;

  useEffect(() => {
    const t = setTimeout(() => onDismiss(notif.id), 12000);
    return () => clearTimeout(t);
  }, [notif.id, onDismiss]);

  function handleOpen() {
    onDismiss(notif.id);
    navigate(`/ticket/${notif.ticketId}`);
  }

  return (
    <div className="toast toast-escalation">
      <div className="toast-content">
        <div className="toast-avatar" style={{ background: notif.customer.avatarColor }}>
          {getInitials(notif.customer.name)}
        </div>
        <div className="toast-body">
          <div className="toast-title">
            <strong>{notif.customer.name}</strong>
            <span className="toast-badge" style={{ color: intent.color, background: intent.bg }}>
              {intent.label}
            </span>
          </div>
          <div className="toast-sub">benötigt menschliche Hilfe</div>
        </div>
      </div>
      <div className="toast-actions">
        <button className="toast-btn-open" onClick={handleOpen}>Jetzt öffnen</button>
        <button className="toast-btn-close" onClick={() => onDismiss(notif.id)}>✕</button>
      </div>
    </div>
  );
}

export default function EscalationToast() {
  const notifications = useStore(s => s.notifications);
  const dismiss = useStore(s => s.dismissNotification);

  if (notifications.length === 0) return null;

  return (
    <div className="toast-container">
      {notifications.slice(0, 5).map(n => (
        <Toast key={n.id} notif={n} onDismiss={dismiss} />
      ))}
    </div>
  );
}
