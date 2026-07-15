/**
 * PageHeader.jsx — Shared page-header components.
 *
 * Two variants:
 *
 *  PageHeader (simple) — list pages, existing API preserved:
 *    <PageHeader title="Drivers" subtitle="..." action={<select>} />
 *
 *  DetailPageHeader — detail pages (Driver, Session, Race Center):
 *    <DetailPageHeader
 *      title="Max Verstappen"
 *      status="Active"
 *      subtitle="Red Bull Racing · #1"
 *      actions={{ secondary: [{label:'Share', onClick}], primary: {label:'Open Race', onClick} }}
 *      overflow={[{label:'Copy link', onClick}, {label:'Export CSV', onClick}]}
 *    />
 *
 * Status badge colours are semantic (green=active, red=primary-crit, grey=finished, etc.)
 * not decorative.
 */
import React, { useState, useEffect, useRef } from 'react';
import { LuEllipsis } from 'react-icons/lu';

// ─── Status badge colour map ───────────────────────────────────────────────────
const STATUS_CLS = {
  Active:    'bg-fastGreen/12 text-fastGreen border-fastGreen/30',
  Live:      'bg-primary/12 text-primary border-primary/30',
  Finished:  'bg-surface-2 text-muted border-border',
  Upcoming:  'bg-blue-500/12 text-blue-400 border-blue-500/30',
  Cancelled: 'bg-error/12 text-error border-error/30',
  DNF:       'bg-warning/12 text-warning border-warning/30',
};

// ─── Detail page header (rich variant) ────────────────────────────────────────
export function DetailPageHeader({ title, status, subtitle, actions, overflow }) {
  const [overflowOpen, setOverflowOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!overflowOpen) return;
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) setOverflowOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [overflowOpen]);

  const statusCls = STATUS_CLS[status] || STATUS_CLS.Finished;

  return (
    <div className="flex items-start justify-between gap-4 py-5 px-5 sm:px-6 border-b border-border bg-surface shrink-0">
      {/* Left: title + status badge + subtitle */}
      <div className="min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-lg font-bold text-text tracking-tight truncate">{title}</h1>
          {status && (
            <span
              className={`
                inline-flex items-center px-2 py-0.5 rounded-full
                text-xs font-medium border
                ${statusCls}
              `}
            >
              {status}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-muted mt-0.5 truncate">{subtitle}</p>
        )}
      </div>

      {/* Right: action buttons + overflow menu */}
      {(actions || (overflow && overflow.length > 0)) && (
        <div className="flex items-center gap-2 shrink-0">
          {/* Secondary pill buttons */}
          {actions?.secondary?.map((a, i) => (
            <button
              key={i}
              className={`btn-outline text-xs px-3 py-1.5 ${a.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={a.disabled ? undefined : a.onClick}
              disabled={a.disabled}
              title={a.title}
            >
              {a.label}
            </button>
          ))}

          {/* Primary action */}
          {actions?.primary && (
            <button
              className={`btn-primary text-xs px-3 py-1.5 ${actions.primary.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={actions.primary.disabled ? undefined : actions.primary.onClick}
              disabled={actions.primary.disabled}
              title={actions.primary.title}
            >
              {actions.primary.label}
            </button>
          )}

          {/* ··· Overflow menu */}
          {overflow && overflow.length > 0 && (
            <div ref={menuRef} className="relative">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-muted hover:text-text hover:border-border-hover transition-colors"
                onClick={() => setOverflowOpen((o) => !o)}
                aria-label="More actions"
                aria-haspopup="menu"
                aria-expanded={overflowOpen}
              >
                <LuEllipsis size={15} />
              </button>

              {overflowOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-1.5 w-44 bg-surface border border-border rounded-xl shadow-panel z-50 py-1 overflow-hidden"
                >
                  {overflow.map((item, i) => (
                    <button
                      key={i}
                      role="menuitem"
                      className="w-full text-left px-3.5 py-2 text-xs text-muted hover:text-text hover:bg-surface-2 transition-colors"
                      onClick={() => {
                        item.onClick?.();
                        setOverflowOpen(false);
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Simple page header (list pages — backward-compatible) ─────────────────────
export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-6 bg-surface rounded-panel border border-border shadow-premium-card p-6">
    <div className="min-w-0">
      <h1 className="text-xl font-bold text-text tracking-tight truncate">{title}</h1>
      {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0 ml-4">{action}</div>}
  </div>
);

// ─── Utility bar components (search / filter) ──────────────────────────────────
export const FilterBar = ({ children }) => (
  <div className="flex flex-wrap items-center gap-3 mb-6">{children}</div>
);

export const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="relative">
    <svg
      className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted"
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <input
      className="input pl-9 w-64"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export const SelectFilter = ({ value, onChange, options, className = '' }) => (
  <select
    className={`input w-auto bg-surface-2 ${className}`}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);
