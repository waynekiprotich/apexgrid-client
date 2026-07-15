import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  HiUsers,
  HiOfficeBuilding,
  HiChartBar,
  HiCalendar,
  HiArrowRight,
  HiFlag,
  HiClock,
  HiLocationMarker,
} from 'react-icons/hi';

import { AppLayout } from '../layouts';
import { standingsApi, sessionsApi } from '../services/resources';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import CircuitTexture from '../components/ui/CircuitTexture';
import TimingStrip from '../components/ui/TimingStrip';
import { formatDate, getSessionLabel } from '../utils/formatters';

// ─── Quick-nav cards ──────────────────────────────────────────────────────────
// Icons from react-icons/hi — no emoji anywhere.
// Border brightens on hover; no scale/shadow theatrics.
const NAV_LINKS = [
  { to: '/drivers',   label: 'Drivers',   Icon: HiUsers,         desc: '20 drivers' },
  { to: '/teams',     label: 'Teams',     Icon: HiOfficeBuilding, desc: 'Constructors' },
  { to: '/analytics', label: 'Analytics', Icon: HiChartBar,      desc: 'Lap & strategy' },
  { to: '/sessions',  label: 'Sessions',  Icon: HiCalendar,      desc: 'Race calendar' },
];

// ─── Session type badge colour map ────────────────────────────────────────────
const SESSION_BADGE = {
  Race:              'text-primary',
  Qualifying:        'text-blue-400',
  Sprint:            'text-tyreMedium',
  'Sprint Qualifying':'text-tyreMedium',
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  const SEASON = 2024;

  const { data: standings, isLoading: standingsLoading } = useQuery({
    queryKey: ['standings', 'drivers', SEASON],
    queryFn: () => standingsApi.drivers({ season: SEASON }),
    select: (res) => res.data?.data ?? [],
    staleTime: 5 * 60 * 1000,
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions', { season: SEASON }],
    queryFn: () => sessionsApi.getAll({ season: SEASON }),
    // Show only Race sessions, most recent first
    select: (res) =>
      (res.data?.data ?? [])
        .filter((s) => s.session_name === 'Race')
        .slice(-4)
        .reverse(),
    staleTime: 5 * 60 * 1000,
  });

  // Derive a session context line from the most recent session
  const latestSession = sessions?.[0];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">

        {/* ── Hero panel ──────────────────────────────────────────────────── */}
        {/*
          The hero is the timing strip — the product doing its job.
          The panel is layered: circuit-texture background → surface panel
          → content. No marketing copy. No gradient text.
        */}
        <section
          className="relative rounded-2xl overflow-hidden border border-border shadow-panel"
          style={{ background: '#0f0f12' }}   /* slightly warmer than bg — clear depth step */
        >
          {/* Ambient circuit-outline texture at ~5% opacity */}
          <CircuitTexture />

          {/* Subtle top-edge highlight (borrowed from macOS panel pattern) */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Content — positioned above texture */}
          <div className="relative z-10 grid lg:grid-cols-[1fr_420px] gap-6 p-5 sm:p-8">

            {/* Left: timing strip + context + CTAs */}
            <div className="flex flex-col justify-center gap-5">
              {/* The product IS the hero */}
              <TimingStrip
                standings={standings}
                loading={standingsLoading}
                season={SEASON}
              />

              {/* Session context line — circuit, session type, one line, mono */}
              <div className="flex items-center gap-3 text-xs font-mono text-muted">
                {sessionsLoading ? (
                  <Skeleton className="h-3 w-56" />
                ) : latestSession ? (
                  <>
                    <HiLocationMarker className="w-3.5 h-3.5 text-muted-2 shrink-0" />
                    <span className="text-muted-2">{latestSession.circuit_short_name}</span>
                    <span className="text-border">·</span>
                    <span
                      className={
                        SESSION_BADGE[latestSession.session_name] ?? 'text-muted'
                      }
                    >
                      {getSessionLabel(latestSession.session_name)}
                    </span>
                    <span className="text-border">·</span>
                    <span className="text-muted-2">{formatDate(latestSession.date_start)}</span>
                  </>
                ) : (
                  <span className="text-muted-2">No session data</span>
                )}
              </div>

              {/* CTAs — below the strip, not competing with it */}
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/dashboard" className="btn-primary">
                  Open Dashboard
                </Link>
                <Link to="/sessions" className="btn-outline">
                  Browse Sessions
                </Link>
              </div>
            </div>

            {/* Right: recent sessions — supplementary, not competing */}
            <div className="hidden lg:flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted uppercase tracking-widest font-mono">
                  Recent Races
                </span>
                <Link
                  to="/sessions"
                  className="text-xs text-muted-2 hover:text-text transition-colors font-mono"
                >
                  All →
                </Link>
              </div>

              {sessionsLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border bg-surface/60 p-3.5 space-y-2"
                    >
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-3.5 w-2/3" />
                      <Skeleton className="h-2.5 w-1/2" />
                    </div>
                  ))
                : sessions?.map((s) => (
                    <Link key={s.session_key} to={`/race-center/${s.session_key}`}>
                      <div
                        className="
                          rounded-lg border border-border bg-surface/60 p-3.5
                          hover:border-border-hover hover:bg-surface
                          transition-colors duration-150 group
                        "
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <HiFlag className="w-3 h-3 text-muted-2 shrink-0" />
                          <span className="text-[10px] font-mono text-muted-2 uppercase tracking-wider">
                            {formatDate(s.date_start)}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-text leading-snug">
                          {s.meeting_name}
                        </p>
                        <p className="text-xs text-muted mt-0.5 font-mono">
                          {s.circuit_short_name}
                        </p>
                      </div>
                    </Link>
                  ))
              }
            </div>
          </div>
        </section>

        {/* ── Quick nav ────────────────────────────────────────────────────── */}
        {/*
          Four cards, one per major section. Real icons from react-icons/hi.
          Hover: border brightens only — no scale, no shadow theatre.
          Motion lives in the timing strip above; here things are quiet.
        */}
        <nav aria-label="Quick navigation" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {NAV_LINKS.map(({ to, label, Icon, desc }) => (
            <Link key={to} to={to} className="group">
              <div
                className="
                  h-full rounded-xl border border-border bg-surface
                  p-4 flex flex-col gap-3
                  hover:border-border-hover hover:bg-surface-2
                  transition-colors duration-150
                  shadow-card
                "
              >
                {/* Icon container — neutral colour, no accent fill */}
                <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center group-hover:border-border-hover transition-colors">
                  <Icon className="w-4 h-4 text-muted group-hover:text-text transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{label}</p>
                  <p className="text-xs text-muted mt-0.5">{desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </nav>

        {/* ── Mobile recent sessions (shown below nav on small screens) ───── */}
        <section className="lg:hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted uppercase tracking-widest font-mono">
              Recent Races
            </span>
            <Link to="/sessions" className="text-xs text-muted-2 hover:text-text transition-colors font-mono">
              All →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {sessionsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-border bg-surface p-4 space-y-2">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-3.5 w-2/3" />
                  </div>
                ))
              : sessions?.map((s) => (
                  <Link key={s.session_key} to={`/race-center/${s.session_key}`}>
                    <div className="rounded-xl border border-border bg-surface p-4 hover:border-border-hover hover:bg-surface-2 transition-colors duration-150">
                      <div className="flex items-center gap-2 mb-1">
                        <HiClock className="w-3 h-3 text-muted-2" />
                        <span className="text-[10px] font-mono text-muted-2 uppercase tracking-wider">
                          {formatDate(s.date_start)}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-text">{s.meeting_name}</p>
                      <p className="text-xs text-muted font-mono">{s.circuit_short_name}</p>
                    </div>
                  </Link>
                ))
            }
          </div>
        </section>

      </div>
    </AppLayout>
  );
}
