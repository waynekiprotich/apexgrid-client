import React from 'react';
import { motion } from 'framer-motion';

export function SettingsToggle({ checked, onChange, label, description, disabled = false }) {
  return (
    <div 
      className={`flex items-center justify-between gap-4 py-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => !disabled && onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text">{label}</p>
        {description && <p className="text-xs text-muted mt-0.5 pr-4">{description}</p>}
      </div>
      
      <div 
        className={`relative flex items-center shrink-0 w-11 h-6 rounded-full transition-colors duration-250 ease-in-out ${
          checked ? 'bg-primary' : 'bg-white/10'
        }`}
      >
        <motion.div 
          layout
          initial={false}
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-5 h-5 bg-white rounded-full shadow-sm"
        />
      </div>
    </div>
  );
}

export function SettingsSegmented({ options, value, onChange }) {
  return (
    <div className="flex p-1 bg-black/40 border border-white/5 rounded-lg overflow-x-auto custom-scrollbar">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`
              relative flex-1 min-w-[80px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200
              ${isSelected ? 'text-white' : 'text-muted hover:text-white hover:bg-white/5'}
            `}
          >
            {isSelected && (
              <motion.div
                layoutId={`segmented-${options.map(o=>o.value).join('-')}`}
                className="absolute inset-0 bg-white/10 border border-white/10 rounded-md shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10 whitespace-nowrap">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
