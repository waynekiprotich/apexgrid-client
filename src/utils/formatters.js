// Team color mapping
export const TEAM_COLORS = {
  'Ferrari': '#e8002d',
  'Mercedes': '#00d2be',
  'Red Bull Racing': '#3671c6',
  'McLaren': '#ff8000',
  'Alpine': '#0093cc',
  'Aston Martin': '#006f62',
  'Williams': '#64c4ff',
  'Haas F1 Team': '#b6babd',
  'Kick Sauber': '#52e252',
  'RB': '#6692ff',
};

export const getTeamColor = (teamName) => {
  if (!teamName) return '#737373';
  const key = Object.keys(TEAM_COLORS).find(k =>
    teamName.toLowerCase().includes(k.toLowerCase())
  );
  return key ? TEAM_COLORS[key] : '#737373';
};

// Format lap time from seconds to mm:ss.mmm
export const formatLapTime = (seconds) => {
  if (!seconds) return '--:--.---';
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3).padStart(6, '0');
  return `${mins}:${secs}`;
};

// Format duration in seconds to human readable
export const formatDuration = (seconds) => {
  if (!seconds) return '--';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

// Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// Session type label
export const SESSION_TYPE_LABELS = {
  'Race': 'Race',
  'Qualifying': 'Qualifying',
  'Sprint': 'Sprint',
  'Sprint Qualifying': 'Sprint Quali',
  'Practice 1': 'FP1',
  'Practice 2': 'FP2',
  'Practice 3': 'FP3',
};

export const getSessionLabel = (type) => SESSION_TYPE_LABELS[type] || type;

// Ordinal suffix (1st, 2nd...)
export const ordinal = (n) => {
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
};

// Tyre compound colors
export const TYRE_COLORS = {
  'SOFT': '#e10600',
  'MEDIUM': '#f59e0b',
  'HARD': '#f5f5f5',
  'INTERMEDIATE': '#22c55e',
  'WET': '#3b82f6',
};

export const getTyreColor = (compound) => TYRE_COLORS[compound?.toUpperCase()] || '#737373';

// Delta formatting
export const formatDelta = (delta) => {
  if (delta === null || delta === undefined) return '--';
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toFixed(3)}s`;
};
