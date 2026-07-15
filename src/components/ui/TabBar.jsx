/**
 * TabBar.jsx — Horizontal tab bar for pages with sub-views.
 *
 * Active tab: 2px bottom border in primary red, full-weight text.
 * Inactive: muted text, no border, hover lifts to text.
 * Count badge: rendered as a small pill on the tab label when `count` is provided.
 *
 * Usage:
 *   <TabBar
 *     tabs={[
 *       { id: 'overview',  label: 'Overview' },
 *       { id: 'laps',      label: 'Laps',      count: 57 },
 *       { id: 'pitstops',  label: 'Pit Stops',  count: 3 },
 *       { id: 'telemetry', label: 'Telemetry' },
 *       { id: 'weather',   label: 'Weather' },
 *     ]}
 *     activeTab={activeTab}
 *     onChange={setActiveTab}
 *   />
 */
import React from 'react';

export function TabBar({ tabs = [], activeTab, onChange }) {
  return (
    <div
      className="flex items-end border-b border-border bg-surface px-4 shrink-0 overflow-x-auto"
      role="tablist"
      aria-label="Page sections"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={`
              flex items-center gap-1.5 shrink-0
              px-4 py-2.5 text-sm font-medium
              border-b-2 -mb-px
              transition-colors duration-150 whitespace-nowrap
              ${isActive
                ? 'border-primary text-text'
                : 'border-transparent text-muted hover:text-text hover:border-border-hover'
              }
            `}
            onClick={() => onChange?.(tab.id)}
          >
            {tab.label}

            {tab.count != null && (
              <span
                className={`
                  inline-flex items-center justify-center
                  min-w-[18px] h-[18px] px-1 rounded-full
                  text-[10px] font-bold leading-none
                  ${isActive
                    ? 'bg-primary/15 text-primary'
                    : 'bg-surface-2 text-muted-2'
                  }
                  transition-colors
                `}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
