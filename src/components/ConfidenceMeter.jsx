import { useEffect, useState } from 'react';

const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getColor(value) {
  if (value >= 85) return 'var(--green)';
  if (value >= 70) return '#f59e0b';
  return 'var(--red)';
}

export default function ConfidenceMeter({ value = 0, size = 44 }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 50);
    return () => clearTimeout(t);
  }, [value]);

  const progress = (animated / 100) * CIRCUMFERENCE;
  const color = getColor(value);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={RADIUS} fill="none" stroke="var(--border)" strokeWidth="3" />
      <circle
        cx={cx} cy={cy} r={RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE - progress}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text
        x={cx} y={cy + 4}
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
        fill={color}
      >
        {value}%
      </text>
    </svg>
  );
}
