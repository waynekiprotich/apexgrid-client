import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '../layouts';
import { sessionsApi } from '../services/resources';
import { DetailPageHeader } from '../components/ui/PageHeader';
import DriverDetailCard from '../components/race/DriverDetailCard';
import WindWidget from '../components/race/WindWidget';
import CircuitTexture from '../components/ui/CircuitTexture';
import { EmptyState } from '../components/ui/StateViews';
import { formatDate } from '../utils/formatters';
import {
  LuFilter,
  LuList,
  LuZoomIn,
  LuZoomOut,
  LuMaximize,
  LuLayers,
  LuCrosshair,
  LuActivity
} from 'react-icons/lu';

const REFETCH_INTERVAL = 10_000; // 10s poll for live data

export default function RaceCenter() {
  const { sessionKey } = useParams();
  
  // Hardcoded selected driver for demonstration of the floating card UI
  // In a real implementation, this would be set by clicking a dot on the map
  const [selectedDriverNum, setSelectedDriverNum] = useState(1);
  const [showRacingLine, setShowRacingLine] = useState(false);
  const [showFlags, setShowFlags] = useState(true);

  // ─── Data Fetching ──────────────────────────────────────────────────────────
  const { data: session } = useQuery({
    queryKey: ['session', sessionKey],
    queryFn: () => sessionsApi.getOne(sessionKey),
    select: (r) => r.data?.data,
  });

  const { data: weather } = useQuery({
    queryKey: ['weather', sessionKey],
    queryFn: () => sessionsApi.getWeather(sessionKey),
    select: (r) => r.data?.data ?? [],
    refetchInterval: 60_000,
  });

  const { data: telemetry } = useQuery({
    queryKey: ['telemetry', sessionKey, selectedDriverNum],
    queryFn: () => sessionsApi.getTelemetry(sessionKey, { driver_number: selectedDriverNum }),
    select: (r) => r.data?.data,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!selectedDriverNum,
  });

  const { data: location } = useQuery({
    queryKey: ['location', sessionKey, selectedDriverNum],
    queryFn: () => sessionsApi.getLocation(sessionKey, { driver_number: selectedDriverNum }),
    select: (r) => r.data?.data,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!selectedDriverNum,
  });

  const { data: driverInfo } = useQuery({
    queryKey: ['driverInfo', selectedDriverNum],
    queryFn: () => sessionsApi.getLaps(sessionKey, { driver_number: selectedDriverNum }),
    select: (r) => r.data?.data,
    enabled: !!selectedDriverNum,
  });

  // Computed Data
  const isSessionFinished = session?.date_end && new Date(session.date_end) < new Date();
  const sessionStatus = isSessionFinished ? 'Finished' : 'Live';
  
  const latestWeather = weather?.[weather.length - 1];

  const currentTelemetry = telemetry?.[telemetry.length - 1] ?? {};
  
  const mockSelectedDriver = {
    driver_number: selectedDriverNum,
    name_acronym: driverInfo?.[0]?.driver_name_acronym || 'VER', // Fallback to VER if not loaded
    team_name: 'Red Bull Racing', // Can be fetched from teams if needed
    position: 1,
    position_change: 0,
  };

  const mockTelemetry = {
    speed: currentTelemetry.speed || 0,
    compound: 'SOFT',
    tyre_life_percent: 100,
    tyre_temp: currentTelemetry.brake_temperature || '--',
    gap_to_leader: 0, 
    gap_status: 'none'
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full overflow-hidden animate-fade-in">
        {/* ── HEADER ROW ────────────────────────────────────────────────────── */}
        <DetailPageHeader
          title={session?.meeting_name ?? `Race Center`}
          status={sessionStatus}
          subtitle={[
            session?.circuit_short_name,
            session?.session_name,
            session?.date_start ? formatDate(session.date_start) : `Session ${sessionKey}`
          ].filter(Boolean).join(' · ')}
          actions={{
            primary: { label: 'Full Race ▾', onClick: () => {}, disabled: true, title: 'Coming soon' }
          }}
        />

        {/* ── FILTER ROW ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-border bg-surface shrink-0 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-text font-bold">All 20</span>
            <span className="text-muted">On Track 18</span>
            <span className="text-muted">In Pit 1</span>
            <span className="text-muted">Retired 1</span>
          </div>
          
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                className="accent-primary w-3.5 h-3.5 cursor-pointer bg-surface-2 border-border" 
                checked={showRacingLine}
                onChange={(e) => setShowRacingLine(e.target.checked)}
              />
              <span className="text-muted group-hover:text-text transition-colors">Show racing line</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                className="accent-primary w-3.5 h-3.5 cursor-pointer bg-surface-2 border-border" 
                checked={showFlags}
                onChange={(e) => setShowFlags(e.target.checked)}
              />
              <span className="text-muted group-hover:text-text transition-colors">Show flags</span>
            </label>
            <div className="w-px h-4 bg-border" />
            <button className="text-muted opacity-50 cursor-not-allowed transition-colors" title="Filter (Coming soon)" disabled>
              <LuFilter size={14} />
            </button>
          </div>
        </div>

        {/* ── MAIN CANVAS ───────────────────────────────────────────────────── */}
        <div className="flex-1 relative bg-[#050505] overflow-hidden">
          
          {/* Track Map (Placeholder using existing SVG until location API is wired) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <CircuitTexture className="w-[80%] h-[80%]" />
          </div>

          {/* Empty State Overlay for missing live location data */}
          {(!location || location.length === 0) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div className="bg-surface/50 backdrop-blur-sm border border-border px-6 py-4 rounded-xl flex flex-col items-center">
                 <LuActivity size={24} className="text-muted mb-2" />
                 <p className="text-sm font-medium text-text">Live telemetry disconnected</p>
                 <p className="text-xs text-muted mt-1">Live location tracking unavailable for this session</p>
              </div>
            </div>
          )}

          {/* FLOATING: Top-Left Driver Card */}
          {selectedDriverNum && (
            <DriverDetailCard 
              driverData={mockSelectedDriver}
              telemetryData={mockTelemetry}
              pitAlert="Tyre degradation high — box window open"
              isPreview={true}
            />
          )}

          {/* FLOATING: Top-Right Wind Widget */}
          <WindWidget weatherData={latestWeather} />

          {/* FLOATING: Bottom-Left Hint */}
          <div className="absolute bottom-4 left-4 text-[10px] text-muted-2 font-mono bg-surface/50 px-2 py-1 rounded backdrop-blur">
            Space + Drag to pan · Scroll to zoom
          </div>

          {/* FLOATING: Bottom-Right Latency */}
          <div className="absolute bottom-4 right-14 text-[10px] text-muted-2 font-mono bg-surface/50 px-2 py-1 rounded backdrop-blur">
            Positions update every 3s
          </div>

          {/* FLOATING: Right-edge icon stack */}
          <div className="absolute top-1/2 -translate-y-1/2 right-3 flex flex-col gap-1.5 bg-surface/80 backdrop-blur-md border border-border rounded-lg p-1 z-10 shadow-panel">
            <button className="p-1.5 text-muted opacity-50 cursor-not-allowed rounded transition-colors" aria-label="List view" title="List view (Coming soon)" disabled>
              <LuList size={15} strokeWidth={2} />
            </button>
            <div className="w-6 h-px bg-border mx-auto my-0.5" />
            <button className="p-1.5 text-muted opacity-50 cursor-not-allowed rounded transition-colors" aria-label="Zoom in" title="Zoom in (Coming soon)" disabled>
              <LuZoomIn size={15} strokeWidth={2} />
            </button>
            <button className="p-1.5 text-muted opacity-50 cursor-not-allowed rounded transition-colors" aria-label="Zoom out" title="Zoom out (Coming soon)" disabled>
              <LuZoomOut size={15} strokeWidth={2} />
            </button>
            <button className="p-1.5 text-muted opacity-50 cursor-not-allowed rounded transition-colors" aria-label="Re-center" title="Re-center (Coming soon)" disabled>
              <LuCrosshair size={15} strokeWidth={2} />
            </button>
            <div className="w-6 h-px bg-border mx-auto my-0.5" />
            <button className="p-1.5 text-muted opacity-50 cursor-not-allowed rounded transition-colors" aria-label="Toggle layers" title="Toggle layers (Coming soon)" disabled>
              <LuLayers size={15} strokeWidth={2} />
            </button>
            <button className="p-1.5 text-muted opacity-50 cursor-not-allowed rounded transition-colors" aria-label="Fullscreen" title="Fullscreen (Coming soon)" disabled>
              <LuMaximize size={15} strokeWidth={2} />
            </button>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
