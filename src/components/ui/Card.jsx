import React from 'react';

// Generic card wrapper
export const Card = ({ children, className = '', hover = false, onClick }) => (
  <div
    className={`card ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

// Card with header + content sections
export const CardWithHeader = ({ title, subtitle, action, children, className = '' }) => (
  <Card className={className}>
    <div className="flex items-center justify-between px-6 py-5 border-b border-border">
      <div>
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
    <div>{children}</div>
  </Card>
);

// Stat block (used in dashboards, driver details)
export const StatBlock = ({ label, value, sub, accent = false }) => (
  <div className="stat-block">
    <span className="stat-label">{label}</span>
    <span className={`stat-value ${accent ? 'text-primary' : ''}`}>{value}</span>
    {sub && <span className="stat-delta text-muted">{sub}</span>}
  </div>
);

// Badge
export const Badge = ({ children, color = 'default', className = '' }) => {
  const colors = {
    default: 'bg-surface-2 text-muted',
    red: 'bg-primary/15 text-primary',
    green: 'bg-success/15 text-success',
    yellow: 'bg-warning/15 text-warning',
    blue: 'bg-blue-500/15 text-blue-400',
  };
  return (
    <span className={`badge ${colors[color] || colors.default} ${className}`}>
      {children}
    </span>
  );
};

// Position badge (P1 P2 P3 with colors)
export const PositionBadge = ({ position }) => {
  const colors = {
    1: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    2: 'bg-slate-400/20 text-slate-300 border border-slate-400/30',
    3: 'bg-amber-700/20 text-amber-600 border border-amber-700/30',
  };
  const cls = colors[position] || 'bg-surface-2 text-muted';
  return (
    <span className={`badge text-xs font-mono font-bold ${cls}`}>
      P{position}
    </span>
  );
};

// Tyre compound badge
export const TyreBadge = ({ compound }) => {
  const colorMap = {
    SOFT: 'bg-red-500/15 text-red-400',
    MEDIUM: 'bg-yellow-500/15 text-yellow-400',
    HARD: 'bg-gray-200/15 text-gray-200',
    INTERMEDIATE: 'bg-green-500/15 text-green-400',
    WET: 'bg-blue-500/15 text-blue-400',
  };
  const c = compound?.toUpperCase();
  return (
    <span className={`badge text-xs font-mono ${colorMap[c] || 'bg-surface-2 text-muted'}`}>
      {c?.[0] || '?'}
    </span>
  );
};

// Team color bar
export const TeamColorBar = ({ color, className = '' }) => (
  <div
    className={`w-1 rounded-full shrink-0 ${className}`}
    style={{ backgroundColor: color }}
  />
);
