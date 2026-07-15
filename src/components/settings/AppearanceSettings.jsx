import React, { useState } from 'react';
import { SettingsCard } from './SettingsCard';
import { SettingsSegmented, SettingsToggle } from './SettingsUI';

export function AppearanceSettings() {
  const [theme, setTheme] = useState('dark');
  const [accent, setAccent] = useState('red');
  const [density, setDensity] = useState('comfortable');
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <SettingsCard title="Appearance" description="Customize how ApexGrid looks and feels on your device.">
      <div className="space-y-8">
        
        {/* Theme */}
        <div>
          <label className="block text-sm font-medium text-text mb-3">Theme</label>
          <SettingsSegmented
            options={[
              { label: 'System', value: 'system' },
              { label: 'Dark', value: 'dark' },
              { label: 'Light', value: 'light' },
            ]}
            value={theme}
            onChange={setTheme}
          />
        </div>

        {/* Accent Color */}
        <div>
          <label className="block text-sm font-medium text-text mb-3">Accent Color</label>
          <div className="flex gap-3">
            {[
              { id: 'red', color: '#e10600' },
              { id: 'blue', color: '#3671c6' },
              { id: 'purple', color: '#9d4edd' },
              { id: 'green', color: '#2bd576' },
            ].map(c => (
              <button
                key={c.id}
                onClick={() => setAccent(c.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  accent === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-bg scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c.color }}
                aria-label={`${c.id} accent color`}
              />
            ))}
          </div>
        </div>

        {/* Density */}
        <div>
          <label className="block text-sm font-medium text-text mb-3">Interface Density</label>
          <SettingsSegmented
            options={[
              { label: 'Compact', value: 'compact' },
              { label: 'Comfortable', value: 'comfortable' },
            ]}
            value={density}
            onChange={setDensity}
          />
        </div>

        <hr className="divider" />

        {/* Animations */}
        <SettingsToggle
          checked={reducedMotion}
          onChange={setReducedMotion}
          label="Reduce Motion"
          description="Minimize animations and layout transitions across the app."
        />
        
      </div>
    </SettingsCard>
  );
}
