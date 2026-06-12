import { NavLink } from 'react-router-dom';
import useStore from '../store/useStore';

const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

const IconQueue = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconHelp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default function Sidebar() {
  const notifications = useStore(s => s.notifications);
  const unread = notifications.length;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-mark">O1</span>
        <span className="sidebar-logo-text">Connect</span>
        <span className="sidebar-logo-sub">Agent Dashboard</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <IconDashboard />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/queue" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
          <IconQueue />
          <span>Ticket-Queue</span>
          {unread > 0 && <span className="sidebar-badge">{unread}</span>}
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className="sidebar-status-dot" />
          <span>Kai online</span>
        </div>
        <div className="sidebar-help">
          <IconHelp />
          <span>O1 Connect GmbH — Pilot v1</span>
        </div>
      </div>
    </aside>
  );
}
