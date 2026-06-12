import { useState } from 'react';
import useStore from '../store/useStore';
import TicketCard from '../components/TicketCard';

const TABS = [
  { key: 'all',      label: 'Alle' },
  { key: 'active',   label: 'KI-Aktiv' },
  { key: 'escalated',label: 'Eskaliert' },
  { key: 'resolved', label: 'Gelöst' },
  { key: 'human',    label: 'Übernommen' },
];

const SORTS = [
  { key: 'newest',     label: 'Neu zuerst' },
  { key: 'confidence', label: 'Konfidenz ↑ (kritisch)' },
];

export default function Queue() {
  const tickets = useStore(s => s.tickets);
  const [activeTab, setActiveTab] = useState('all');
  const [sort, setSort] = useState('newest');

  const activeCount = tickets.filter(t => t.status === 'active').length;

  const filtered = tickets.filter(t => {
    if (activeTab === 'all') return true;
    return t.status === activeTab;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'confidence') {
      const confA = [...a.messages].reverse().find(m => m.role === 'kai')?.confidence ?? 999;
      const confB = [...b.messages].reverse().find(m => m.role === 'kai')?.confidence ?? 999;
      return confA - confB;
    }
    return b.createdAt - a.createdAt;
  });

  function tabCount(key) {
    if (key === 'all') return tickets.length;
    return tickets.filter(t => t.status === key).length;
  }

  return (
    <div className="page">
      <div className="page-header queue-header">
        <div>
          <h1 className="page-title">Ticket-Queue</h1>
          <p className="page-sub">Eingehende KI-Chats in Echtzeit</p>
        </div>
        <div className="queue-live-badge">
          <span className="live-dot" />
          <span>{activeCount} aktive KI-Chats</span>
        </div>
      </div>

      <div className="queue-controls">
        <div className="queue-tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`queue-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className="tab-count">{tabCount(tab.key)}</span>
            </button>
          ))}
        </div>
        <select
          className="queue-sort"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          {SORTS.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="ticket-list">
        {sorted.length === 0 ? (
          <div className="empty-state-card">
            <p>Keine Tickets in dieser Kategorie.</p>
          </div>
        ) : (
          sorted.map(t => <TicketCard key={t.id} ticket={t} />)
        )}
      </div>
    </div>
  );
}
