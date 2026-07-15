import React from 'react';
import { getTeamColor } from '../../utils/formatters';
import { Skeleton } from './Skeleton';

/**
 * TimingStrip — the hero element of the Home page.
 *
 * Styled after an F1 broadcast timing tower: each row shows position,
 * 3-letter driver code, a 3px team-colour left border (the "livery tab"),
 * and the gap to the leader expressed as a points delta.
 *
 * Colour semantics (strict — do not use these colours anywhere else for
 * decoration):
 *   purple   — fastest overall (P1's row indicator)
 *   fastGreen — active points gain vs. prior race (future: personalBest lap)
 *   white/muted — standard rows
 *
 * Loading state: skeleton rows, same height as real rows, no layout shift.
 * Empty state: informational placeholder — no crash, no spinner loop.
 */

// Build a gap string from points relative to leader.
// Returns "LEADER" for P1, "-N pts" for others.
function buildGap(driver, leaderPoints) {
  if (!driver || leaderPoints == null) return '--';
  const pts = driver.points ?? 0;
  const lead = leaderPoints ?? 0;
  if (pts >= lead) return 'LEADER';
  const delta = lead - pts;
  return `-${delta} pts`;
}

// Pick a gap colour:
//   P1 → subtle purple tint (broadcast: fastest overall indicator)
//   Drivers within 25pts of leader → fastGreen (within striking distance)
//   Others → muted
function gapColor(index, driver, leaderPoints) {
  if (index === 0) return 'text-purple';
  const gap = (leaderPoints ?? 0) - (driver?.points ?? 0);
  if (gap <= 25) return 'text-fastGreen';
  return 'text-muted';
}

// Extract a 3-letter code from driver data.
// OpenF1 returns `acronym` on driver objects; fall back gracefully.
function driverCode(driver) {
  if (driver?.acronym) return driver.acronym;
  if (driver?.last_name) return driver.last_name.slice(0, 3).toUpperCase();
  if (driver?.driver_number) return `#${driver.driver_number}`;
  return '???';
}

const VISIBLE_ROWS = 10;

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: VISIBLE_ROWS }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 h-10 px-4 border-b border-border/50 last:border-0"
          style={{ opacity: 1 - i * 0.07 }}
        >
          <Skeleton className="h-3 w-6" />           {/* pos */}
          <Skeleton className="h-3.5 w-10" />         {/* code */}
          <Skeleton className="h-3 flex-1" />         {/* team */}
          <Skeleton className="h-3 w-16" />           {/* gap */}
        </div>
      ))}
    </>
  );
}

export default function TimingStrip({ standings, loading, season = 2024 }) {
  const leaderPoints = standings?.[0]?.points ?? null;

  return (
    <div className="relative rounded-xl border border-border overflow-hidden shadow-panel">
      {/* Header bar — broadcast-style chyron */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-border">
        <div className="flex items-center gap-2.5">
          {/* Primary indicator: live/standings */}
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted tracking-widest uppercase font-mono">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-primary"
              style={{ boxShadow: '0 0 6px rgba(225,6,0,0.6)' }}
            />
            Driver Standings
          </span>
          <span className="text-muted-2 text-xs font-mono">{season}</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-muted-2">
          <span className="hidden sm:inline">PTS GAP</span>
        </div>
      </div>

      {/* Column headers — same as a real timing tower */}
      <div className="grid grid-cols-[32px_52px_1fr_80px] gap-x-3 px-4 py-1.5 bg-surface-2/60 border-b border-border">
        <span className="text-[10px] font-mono font-medium text-muted-2 uppercase tracking-widest">Pos</span>
        <span className="text-[10px] font-mono font-medium text-muted-2 uppercase tracking-widest">Driver</span>
        <span className="text-[10px] font-mono font-medium text-muted-2 uppercase tracking-widest">Constructor</span>
        <span className="text-[10px] font-mono font-medium text-muted-2 uppercase tracking-widest text-right">Gap</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/50 bg-surface">
        {loading ? (
          <SkeletonRows />
        ) : !standings || standings.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm text-muted font-mono">
            No standings data
          </div>
        ) : (
          standings.slice(0, VISIBLE_ROWS).map((driver, i) => {
            const teamColor = getTeamColor(driver.team_name);
            const code = driverCode(driver);
            const gap = buildGap(driver, leaderPoints);
            const gapCls = gapColor(i, driver, leaderPoints);
            const isLeader = i === 0;

            return (
              <div
                key={driver.driver_number ?? i}
                className={`
                  group grid grid-cols-[32px_52px_1fr_80px] gap-x-3
                  items-center h-10 px-4 transition-colors duration-100
                  hover:bg-surface-2
                  animate-fade-row
                `}
                style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'both' }}
              >
                {/* Position */}
                <span
                  className={`
                    text-sm font-mono font-bold tabular-nums
                    ${isLeader ? 'text-text' : 'text-muted'}
                  `}
                >
                  P{i + 1}
                </span>

                {/* Driver code + livery tab */}
                <div className="flex items-center gap-1.5">
                  {/* 3px team colour tab — the semantic livery marker */}
                  <div
                    className="w-[3px] h-[18px] rounded-full shrink-0"
                    style={{ backgroundColor: teamColor }}
                    aria-label={driver.team_name}
                  />
                  <span
                    className={`
                      text-sm font-mono font-bold tracking-wider
                      ${isLeader ? 'text-text' : 'text-muted group-hover:text-text'}
                      transition-colors
                    `}
                  >
                    {code}
                  </span>
                </div>

                {/* Constructor name */}
                <span className="text-xs text-muted-2 truncate font-sans">
                  {driver.team_name ?? '--'}
                </span>

                {/* Points gap — mono, semantically coloured */}
                <span
                  className={`
                    text-xs font-mono font-bold tabular-nums text-right
                    ${gapCls}
                    ${isLeader ? 'tracking-tighter' : ''}
                  `}
                >
                  {gap}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Footer — data source attribution, small */}
      <div className="px-4 py-2 bg-surface border-t border-border flex items-center justify-between">
        <span className="text-[10px] text-muted-2 font-mono uppercase tracking-widest">
          via OpenF1 · cached
        </span>
        <div className="flex items-center gap-3 text-[10px] font-mono text-muted-2">
          <span className="flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple opacity-70" />
            P1
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-fastGreen opacity-70" />
            &lt;25 pts gap
          </span>
        </div>
      </div>
    </div>
  );
}
