import React from 'react';
import { SettingsCard } from './SettingsCard';

export function KeyboardShortcuts() {
  const shortcuts = [
    { label: 'Global Search', keys: ['⌘', 'K'] },
    { label: 'Global Search (Alternative)', keys: ['/'] },
    { label: 'Go to Dashboard', keys: ['G', 'D'] },
    { label: 'Go to Settings', keys: ['G', 'S'] },
    { label: 'Close Modal', keys: ['Esc'] },
  ];

  return (
    <SettingsCard title="Keyboard Shortcuts" description="Navigate ApexGrid efficiently with these shortcuts.">
      <div className="space-y-4">
        {shortcuts.map((sc, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 last:pb-0">
            <span className="text-sm text-text">{sc.label}</span>
            <div className="flex gap-1.5">
              {sc.keys.map((k, j) => (
                <kbd key={j} className="min-w-[24px] h-6 flex items-center justify-center px-1.5 text-xs font-mono font-medium text-muted bg-white/5 border border-white/10 rounded shadow-sm">
                  {k}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted mt-6 text-center">Custom shortcuts are coming in a future update.</p>
    </SettingsCard>
  );
}
