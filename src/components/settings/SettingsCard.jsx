import React from 'react';

export function SettingsCard({ title, description, children, danger = false }) {
  return (
    <div className={`card overflow-hidden transition-all ${danger ? 'border-error/30 bg-error/5' : ''}`}>
      {/* Header */}
      {(title || description) && (
        <div className={`px-5 py-4 border-b ${danger ? 'border-error/20' : 'border-white/5'}`}>
          {title && <h3 className={`text-sm font-semibold ${danger ? 'text-error' : 'text-text'}`}>{title}</h3>}
          {description && <p className={`text-xs mt-1 ${danger ? 'text-error/80' : 'text-muted'}`}>{description}</p>}
        </div>
      )}
      
      {/* Content */}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}
