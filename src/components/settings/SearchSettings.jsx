import React, { useState } from 'react';
import { SettingsCard } from './SettingsCard';
import { SettingsToggle } from './SettingsUI';

export function SearchSettings() {
  const [saveHistory, setSaveHistory] = useState(true);
  
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your search history?")) {
      // Mock clearing history
      alert("Search history cleared.");
    }
  };

  return (
    <SettingsCard title="Search & History" description="Manage your search preferences and recent history.">
      <div className="space-y-6">
        <SettingsToggle
          checked={saveHistory}
          onChange={setSaveHistory}
          label="Save Search History"
          description="Keep track of your recent searches for quicker access in the command palette."
        />
        
        <hr className="divider" />
        
        <div>
          <h4 className="text-sm font-medium text-text mb-2">Clear History</h4>
          <p className="text-xs text-muted mb-4">Remove all recently searched items from your local device.</p>
          <button 
            className="btn btn-outline text-error border-error/30 hover:bg-error/10 hover:border-error/50"
            onClick={handleClearHistory}
          >
            Clear Search History
          </button>
        </div>
      </div>
    </SettingsCard>
  );
}
