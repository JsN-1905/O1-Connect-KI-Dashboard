import { useEffect, useRef, useState } from 'react';
import useStore from '../store/useStore';
import { getKaiResponse } from '../utils/kai';
import { cancelTicket } from '../utils/simulator';
import { INTENT_LABELS } from './TicketCard';

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function ConfidenceBar({ value }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(value), 80); return () => clearTimeout(t); }, [value]);
  const color = value >= 85 ? 'var(--green)' : value >= 70 ? '#f59e0b' : 'var(--red)';
  return (
    <div className="conf-bar-wrap">
      <div className="conf-bar-track">
        <div className="conf-bar-fill" style={{ width: `${width}%`, background: color, transition: 'width 0.6s ease' }} />
      </div>
      <span className="conf-bar-label" style={{ color }}>{value}%</span>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="chat-msg-row left">
      <div className="kai-avatar">K</div>
      <div className="typing-indicator">
        <span /><span /><span />
      </div>
    </div>
  );
}

function Message({ msg, customer }) {
  const intent = msg.intent_category ? INTENT_LABELS[msg.intent_category] : null;

  if (msg.role === 'customer') {
    return (
      <div className="chat-msg-row right">
        <div className="chat-bubble customer-bubble">{msg.message}</div>
        <div className="chat-avatar-sm" style={{ background: customer.avatarColor }}>
          {getInitials(customer.name)}
        </div>
      </div>
    );
  }

  if (msg.role === 'agent') {
    return (
      <div className="chat-msg-row right">
        <div className="chat-bubble agent-bubble">{msg.message}</div>
        <div className="chat-avatar-sm agent-avatar-sm">A</div>
      </div>
    );
  }

  return (
    <div className="chat-msg-row left">
      <div className="kai-avatar">K</div>
      <div className="kai-msg-wrap">
        <div className="chat-bubble kai-bubble">{msg.message}</div>
        <div className="kai-meta">
          {msg.confidence && <ConfidenceBar value={msg.confidence} />}
          <div className="kai-meta-right">
            {intent && (
              <span className="intent-chip" style={{ color: intent.color, background: intent.bg }}>
                {intent.label}
              </span>
            )}
            {msg.responseTime && (
              <span className="response-time">beantwortet in {msg.responseTime.toFixed(1)}s</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatView({ ticket }) {
  const { messages, isTyping, status, customer } = ticket;
  const addMessage = useStore(s => s.addMessage);
  const setTyping = useStore(s => s.setTyping);
  const setTicketHuman = useStore(s => s.setTicketHuman);
  const escalateTicket = useStore(s => s.escalateTicket);
  const dismissNotification = useStore(s => s.dismissNotification);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [humanBanner, setHumanBanner] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (status === 'human') setHumanBanner(true);
  }, [status]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;
    setInput('');

    if (status === 'human') {
      addMessage(ticket.id, {
        id: Date.now() + Math.random(),
        role: 'agent',
        message: text,
        timestamp: Date.now(),
      });
      return;
    }

    cancelTicket(ticket.id);

    addMessage(ticket.id, {
      id: Date.now() + Math.random(),
      role: 'customer',
      message: text,
      timestamp: Date.now(),
    });

    setIsSending(true);
    setTyping(ticket.id, true);

    try {
      const res = await getKaiResponse(text);
      setTyping(ticket.id, false);
      addMessage(ticket.id, {
        id: Date.now() + Math.random(),
        role: 'kai',
        message: res.message,
        confidence: res.confidence,
        intent_category: res.intent_category,
        action: res.action,
        timestamp: Date.now(),
        responseTime: ((700 + Math.random() * 700) / 1000).toFixed(1) * 1,
      });

      if (res.action === 'escalate') {
        setTimeout(() => escalateTicket(ticket.id, res.message), 400);
      }
    } catch {
      setTyping(ticket.id, false);
    } finally {
      setIsSending(false);
    }
  }

  function handleTakeOver() {
    cancelTicket(ticket.id);
    setTicketHuman(ticket.id);
    const { notifications } = useStore.getState();
    const n = notifications.find(x => x.ticketId === ticket.id);
    if (n) dismissNotification(n.id);
    setHumanBanner(true);
  }

  const isEscalated = status === 'escalated';
  const isHuman = status === 'human';

  return (
    <div className="chat-view">
      <div className="chat-header">
        <div className="chat-avatar" style={{ background: customer.avatarColor }}>
          {getInitials(customer.name)}
        </div>
        <div className="chat-header-info">
          <div className="chat-header-name">
            {isHuman ? '👤 Menschlicher Agent aktiv' : customer.name}
          </div>
          <div className="chat-header-sub">{customer.tarif} · #{customer.kundennummer}</div>
        </div>
        <div className="chat-header-right">
          <span className={`chat-status-pill ${status}`}>
            {status === 'active' ? 'KI Aktiv' : status === 'escalated' ? 'Eskaliert' : status === 'resolved' ? 'Gelöst' : 'Agent'}
          </span>
        </div>
      </div>

      {humanBanner && (
        <div className="human-banner">
          ✅ Sie haben dieses Gespräch übernommen
        </div>
      )}

      <div className="chat-messages" ref={scrollRef}>
        {messages.map(msg => (
          <Message key={msg.id} msg={msg} customer={customer} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {isEscalated && !isHuman && (
        <div className="escalation-banner">
          <div className="escalation-banner-header">
            ⚡ Kai kann diese Anfrage nicht abschließen
          </div>
          <div className="escalation-banner-body">
            Dieser Vorgang erfordert manuelle Bearbeitung durch einen autorisierten Mitarbeiter.
          </div>
          <div className="escalation-banner-actions">
            <button className="btn-takeover" onClick={handleTakeOver}>Gespräch übernehmen</button>
            <button className="btn-close-ticket" onClick={() => {}}>Ticket schließen</button>
          </div>
        </div>
      )}

      {(isHuman || (!isEscalated && status !== 'resolved')) && (
        <form className="chat-input-form" onSubmit={handleSend}>
          <input
            className="chat-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={isHuman ? 'Antwort als Agent eingeben…' : 'Testnachricht an Kai eingeben…'}
            disabled={isSending}
          />
          <button className="chat-send-btn" type="submit" disabled={!input.trim() || isSending}>
            Senden
          </button>
        </form>
      )}
    </div>
  );
}
