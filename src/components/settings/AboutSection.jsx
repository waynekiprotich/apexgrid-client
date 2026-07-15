import React from 'react';
import { SettingsCard } from './SettingsCard';
import { LuExternalLink, LuShieldCheck, LuServer } from 'react-icons/lu';

export function AboutSection() {
  return (
    <SettingsCard>
      <div className="flex flex-col items-center justify-center text-center py-6">
        <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22H22L12 2Z" fill="currentColor"/>
          </svg>
        </div>
        <h3 className="text-lg font-bold text-text">ApexGrid</h3>
        <p className="text-sm text-muted">Version 1.0.0 (Build 42)</p>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
          <div className="flex items-center gap-3">
            <LuServer className="text-green-500" />
            <span className="text-sm text-text">API Status</span>
          </div>
          <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">Operational</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
          <div className="flex items-center gap-3">
            <LuShieldCheck className="text-green-500" />
            <span className="text-sm text-text">Firebase Status</span>
          </div>
          <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">Operational</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <a href="#" className="text-xs text-muted hover:text-primary transition-colors flex items-center gap-1">
          Documentation <LuExternalLink size={12} />
        </a>
        <a href="#" className="text-xs text-muted hover:text-primary transition-colors flex items-center gap-1">
          GitHub Repository <LuExternalLink size={12} />
        </a>
        <a href="#" className="text-xs text-muted hover:text-primary transition-colors flex items-center gap-1">
          Privacy Policy <LuExternalLink size={12} />
        </a>
        <a href="#" className="text-xs text-muted hover:text-primary transition-colors flex items-center gap-1">
          Terms of Service <LuExternalLink size={12} />
        </a>
      </div>
    </SettingsCard>
  );
}
