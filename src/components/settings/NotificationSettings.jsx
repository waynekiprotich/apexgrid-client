import React, { useState } from 'react';
import { SettingsCard } from './SettingsCard';
import { SettingsToggle } from './SettingsUI';

export function NotificationSettings() {
  const [prefs, setPrefs] = useState({
    raceReminders: true,
    sessionAlerts: false,
    driverUpdates: true,
    teamNews: false,
    productUpdates: true,
    marketing: false,
  });

  const toggle = (key) => {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  };

  return (
    <SettingsCard title="Notifications" description="Choose what you want to be notified about.">
      <div className="space-y-2">
        <SettingsToggle
          checked={prefs.raceReminders}
          onChange={() => toggle('raceReminders')}
          label="Race Reminders"
          description="Get notified 1 hour before a race starts."
        />
        <SettingsToggle
          checked={prefs.sessionAlerts}
          onChange={() => toggle('sessionAlerts')}
          label="Session Start Alerts"
          description="Alerts for Practice and Qualifying sessions."
        />
        <SettingsToggle
          checked={prefs.driverUpdates}
          onChange={() => toggle('driverUpdates')}
          label="Driver Updates"
          description="News and penalty alerts for your favorite drivers."
        />
        <SettingsToggle
          checked={prefs.teamNews}
          onChange={() => toggle('teamNews')}
          label="Team News"
          description="Updates and press releases for your favorite teams."
        />
        <hr className="divider my-2" />
        <SettingsToggle
          checked={prefs.productUpdates}
          onChange={() => toggle('productUpdates')}
          label="Product Updates"
          description="Changelogs and new features for ApexGrid."
        />
        <SettingsToggle
          checked={prefs.marketing}
          onChange={() => toggle('marketing')}
          label="Marketing Emails"
          description="Promotional content and partner offers."
        />
      </div>
    </SettingsCard>
  );
}
