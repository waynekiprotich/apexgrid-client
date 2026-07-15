import React from 'react';
import { LuTriangleAlert } from 'react-icons/lu';
import { getTeamColor } from '../../utils/formatters';

// ─── Circular Gauge Component ────────────────────────────────────────────────
function CircularGauge({ value, max, label, subtext, colorClass = 'text-white' }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Background track */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40" cy="40" r={radius}
            className="stroke-surface-2"
            strokeWidth="6" fill="transparent"
          />
          {/* Progress arc */}
          <circle
            cx="40" cy="40" r={radius}
            className={`transition-all duration-500 ease-out ${colorClass}`}
            strokeWidth="6" fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        {/* Value text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-mono font-bold text-text leading-none">{value}</span>
          <span className="text-[9px] text-muted-2 uppercase mt-0.5">{label}</span>
        </div>
      </div>
      {subtext && <span className="text-[10px] text-muted mt-1 font-mono">{subtext}</span>}
    </div>
  );
}

// ─── Speed Gauge Component ──────────────────────────────────────────────────
function SpeedGauge({ speed }) {
  const maxSpeed = 360; // km/h
  const isHigh = speed > 300;
  
  return (
    <div className="flex flex-col items-center relative">
      <CircularGauge
        value={speed}
        max={maxSpeed}
        label="KM/H"
        subtext="Live Telemetry"
        colorClass="stroke-white"
      />
      {isHigh && (
        <div className="absolute -top-1 -right-2 bg-fastGreen/15 text-fastGreen border border-fastGreen/30 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
          High
        </div>
      )}
    </div>
  );
}

// ─── Tyre Gauge Component ───────────────────────────────────────────────────
function TyreGauge({ compound, lifePercent, temp }) {
  // Map compound to semantic tailwind text/stroke color classes
  const compoundColors = {
    SOFT: 'stroke-tyreSoft text-tyreSoft',
    MEDIUM: 'stroke-tyreMedium text-tyreMedium',
    HARD: 'stroke-tyreHard text-tyreHard',
    INTER: 'stroke-tyreInter text-tyreInter',
    WET: 'stroke-tyreWet text-tyreWet',
  };
  
  const colorCls = compoundColors[compound?.toUpperCase()] || 'stroke-white text-white';

  return (
    <div className="flex flex-col items-center">
      <CircularGauge
        value={lifePercent}
        max={100}
        label={compound?.substring(0, 3).toUpperCase() || 'UNK'}
        subtext={`${temp}°C Core`}
        colorClass={colorCls}
      />
    </div>
  );
}

// ─── Delta Bar Component ────────────────────────────────────────────────────
function DeltaBar({ gap, status }) {
  // status: 'fastest' (purple), 'personal' (green), 'none' (white)
  const bgClass = 
    status === 'fastest' ? 'bg-purple' : 
    status === 'personal' ? 'bg-fastGreen' : 
    'bg-white';
    
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
        <span className="text-muted uppercase">Interval to LDR</span>
        <span className={`font-bold ${status === 'fastest' ? 'text-purple' : status === 'personal' ? 'text-fastGreen' : 'text-text'}`}>
          {gap > 0 ? `+${gap.toFixed(3)}s` : 'LEADER'}
        </span>
      </div>
      <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
        {/* Simple visual representation of gap. Capped at 10s for visual scale */}
        <div 
          className={`h-full ${bgClass} rounded-full transition-all duration-300`}
          style={{ width: gap === 0 ? '100%' : `${Math.max(5, 100 - (gap * 10))}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main Floating Card Component ──────────────────────────────────────────
export default function DriverDetailCard({ driverData, telemetryData, pitAlert, isPreview }) {
  if (!driverData) return null;

  const { driver_number, name_acronym, team_name, position, position_change } = driverData;
  const teamColor = getTeamColor(team_name);
  
  const speed = telemetryData?.speed || 0;
  const compound = telemetryData?.compound || 'SOFT';
  const lifePercent = telemetryData?.tyre_life_percent || 100;
  const temp = telemetryData?.tyre_temp || 100;
  const gap = telemetryData?.gap_to_leader || 0;
  const gapStatus = telemetryData?.gap_status || 'none'; // fastest, personal, none

  return (
    <div className="absolute top-4 left-4 w-72 bg-surface/90 backdrop-blur-md border border-border shadow-panel rounded-xl overflow-hidden z-10 pointer-events-auto animate-fade-in">
      {/* Top Banner: Team Color Strip */}
      <div className="h-1.5 w-full" style={{ backgroundColor: teamColor || '#555' }} />
      
      <div className="p-4">
        {/* Header: Driver & Position */}
        <div className="flex items-start justify-between">
          <div className="relative">
            {isPreview && (
              <span className="absolute -top-3 left-0 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 text-[8px] uppercase px-1 py-0.5 rounded font-bold tracking-wider">
                Preview Data
              </span>
            )}
            <div className={`flex items-baseline gap-2 ${isPreview ? 'mt-2' : ''}`}>
              <h2 className="text-2xl font-black text-text tracking-tighter leading-none">{name_acronym || 'UNK'}</h2>
              <span className="text-sm font-mono text-muted">#{driver_number}</span>
            </div>
            <p className="text-[10px] text-muted-2 uppercase tracking-wide mt-1 truncate max-w-[140px]">{team_name}</p>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="bg-surface-2 border border-border px-2 py-0.5 rounded flex items-center gap-1.5">
              <span className="text-xs font-bold text-text">P{position || '-'}</span>
              {position_change > 0 && <span className="text-[9px] font-mono text-fastGreen">▲{position_change}</span>}
              {position_change < 0 && <span className="text-[9px] font-mono text-error">▼{Math.abs(position_change)}</span>}
              {position_change === 0 && <span className="text-[9px] font-mono text-muted">-</span>}
            </div>
          </div>
        </div>

        {/* Gap Delta Bar */}
        <DeltaBar gap={gap} status={gapStatus} />

        {/* Gauges */}
        <div className="flex items-center justify-around mt-5 border-t border-border pt-4">
          <SpeedGauge speed={speed} />
          <div className="w-px h-16 bg-border" />
          <TyreGauge compound={compound} lifePercent={lifePercent} temp={temp} />
        </div>
      </div>

      {/* Alert Banner (Optional) */}
      {pitAlert && (
        <div className="bg-warning/10 border-t border-warning/20 px-3 py-2 flex items-start gap-2">
          <LuTriangleAlert size={14} className="text-warning mt-0.5 shrink-0" />
          <p className="text-[10px] text-warning font-medium leading-tight">{pitAlert}</p>
        </div>
      )}
    </div>
  );
}
