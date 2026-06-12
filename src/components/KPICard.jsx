import { useEffect, useState } from 'react';

function getStatus(type, value) {
  if (type === 'deflection') {
    if (value >= 40) return 'good';
    if (value >= 20) return 'warn';
    return 'bad';
  }
  if (type === 'confidence') {
    if (value >= 80) return 'good';
    if (value >= 60) return 'warn';
    return 'bad';
  }
  if (type === 'escalation') {
    if (value <= 20) return 'good';
    if (value <= 35) return 'warn';
    return 'bad';
  }
  return 'neutral';
}

export default function KPICard({ title, value, unit = '', target, targetLabel, type, trend, icon }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDisplayValue(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  const status = getStatus(type, value);
  const statusColors = { good: 'var(--green)', warn: '#f59e0b', bad: 'var(--red)', neutral: 'var(--blue)' };
  const statusBg = { good: 'var(--green-light)', warn: '#fffbeb', bad: 'var(--red-light)', neutral: 'var(--blue-light)' };
  const statusLabels = { good: 'Ziel erreicht', warn: 'In Entwicklung', bad: 'Unter Ziel', neutral: '' };

  const progress = target > 0 ? Math.min(100, (value / target) * 100) : 0;

  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-icon">{icon}</span>
        {type && (
          <span
            className="kpi-status-pill"
            style={{ background: statusBg[status], color: statusColors[status] }}
          >
            {statusLabels[status]}
          </span>
        )}
      </div>
      <div className="kpi-value">
        <span className="kpi-number">{Math.round(displayValue)}</span>
        <span className="kpi-unit">{unit}</span>
        {trend !== undefined && (
          <span className={`kpi-trend ${trend >= 0 ? 'up' : 'down'}`}>
            {trend >= 0 ? '↑' : '↓'}
          </span>
        )}
      </div>
      <div className="kpi-title">{title}</div>
      {target > 0 && (
        <>
          <div className="kpi-bar-track">
            <div
              className="kpi-bar-fill"
              style={{
                width: `${progress}%`,
                background: statusColors[status],
                transition: 'width 0.8s ease',
              }}
            />
          </div>
          <div className="kpi-target-label">
            Ziel: {targetLabel}
          </div>
        </>
      )}
    </div>
  );
}
