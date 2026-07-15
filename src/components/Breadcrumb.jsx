import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LuHouse, LuChevronRight } from 'react-icons/lu';

// Map URL segments to human-readable labels
const SEGMENT_LABELS = {
  dashboard:    'Dashboard',
  drivers:      'Drivers',
  teams:        'Teams',
  sessions:     'Sessions',
  'race-center':'Race Center',
  analytics:    'Analytics',
  favorites:    'Favorites',
  profile:      'Profile',
  login:        'Sign In',
  register:     'Register',
  settings:     'Settings',
  help:         'Help',
};

function segmentLabel(seg) {
  if (SEGMENT_LABELS[seg]) return SEGMENT_LABELS[seg];
  // Numeric: looks like a driver number or session key
  if (/^\d+$/.test(seg)) return `#${seg}`;
  // Fallback: title-case the slug
  return seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  // No crumbs on root
  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => ({
    label: segmentLabel(seg),
    to:    '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav
      aria-label="Breadcrumb"
      className="hidden md:flex items-center gap-1.5 text-xs font-medium"
    >
      {/* Home */}
      <Link
        to="/"
        className="flex items-center justify-center w-6 h-6 rounded-md text-muted hover:text-white hover:bg-white/5 transition-colors"
        aria-label="Home"
      >
        <LuHouse size={13} />
      </Link>

      {crumbs.map((crumb) => (
        <React.Fragment key={crumb.to}>
          <LuChevronRight size={12} className="text-muted/50 shrink-0 mx-0.5" />
          {crumb.isLast ? (
            <span className="text-white bg-white/10 px-2.5 py-1 rounded-md shadow-sm truncate max-w-[200px]">
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.to}
              className="text-muted hover:text-white px-2 py-1 rounded-md hover:bg-white/5 transition-colors truncate max-w-[160px]"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
