import React from 'react';
import { LuWind } from 'react-icons/lu';

export default function WindWidget({ weatherData }) {
  // If no data, show empty state inside the widget structure
  const speed = weatherData?.wind_speed ?? '--';
  const direction = weatherData?.wind_direction ?? 0; // degrees

  return (
    <div className="absolute top-4 right-4 w-28 h-28 bg-surface/80 backdrop-blur-md border border-border shadow-panel rounded-full flex flex-col items-center justify-center pointer-events-auto z-10">
      {/* Compass Tick Marks (Static Background) */}
      <div className="absolute inset-0 rounded-full border-[2px] border-surface-2" />
      <div className="absolute inset-1 rounded-full border-[1px] border-dashed border-border opacity-50" />
      
      {/* N, E, S, W Labels */}
      <span className="absolute top-1 text-[8px] font-mono text-muted">N</span>
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[8px] font-mono text-muted">E</span>
      <span className="absolute bottom-1 text-[8px] font-mono text-muted">S</span>
      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[8px] font-mono text-muted">W</span>

      {/* Wind Direction Arrow - Rotates based on wind_direction */}
      {weatherData && (
        <div 
          className="absolute inset-0 flex justify-center transition-transform duration-1000 ease-out"
          style={{ transform: `rotate(${direction}deg)` }}
        >
          {/* Arrow pointing in the wind direction */}
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-primary -mt-1" />
        </div>
      )}

      {/* Center Value */}
      <div className="relative z-10 flex flex-col items-center bg-surface w-14 h-14 rounded-full justify-center border border-surface-2 shadow-inner">
        <LuWind size={12} className="text-muted mb-0.5" />
        <span className="text-xs font-mono font-bold text-text leading-none">
          {speed}
        </span>
        <span className="text-[8px] text-muted-2 uppercase mt-0.5">m/s</span>
      </div>
    </div>
  );
}
