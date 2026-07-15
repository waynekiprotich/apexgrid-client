import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '../layouts';
import { driversApi, sessionsApi } from '../services/resources';
import { Card, CardWithHeader, StatBlock, TeamColorBar, Badge } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/StateViews';
import { getTeamColor, formatLapTime, formatDate } from '../utils/formatters';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function DriverDetails() {
  const { id } = useParams();
  const [season, setSeason] = useState(2024);

  const { data: driver, isLoading, error, refetch } = useQuery({
    queryKey: ['driver', id, season],
    queryFn: () => driversApi.getOne(id, { season }),
    select: (r) => r.data?.data,
  });

  const teamColor = getTeamColor(driver?.team_name);

  // Fetch recent sessions to show session-level data
  const { data: sessions } = useQuery({
    queryKey: ['sessions', { season }],
    queryFn: () => sessionsApi.getAll({ season }),
    select: (r) => (r.data?.data ?? []).filter(s => s.session_name === 'Race').slice(0, 8),
    enabled: !!driver,
  });

  if (error) {
    return (
      <AppLayout>
        <div className="py-8">
          <Link to="/drivers" className="text-sm text-muted hover:text-text mb-6 inline-block">
            ← Back to Drivers
          </Link>
          <ErrorState message="Failed to load driver profile" onRetry={refetch} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="py-4 md:py-8 animate-fade-in">
        {/* Breadcrumb */}
        <Link to="/drivers" className="text-xs text-muted hover:text-text transition-colors inline-flex items-center gap-1 mb-6">
          ← Drivers
        </Link>

        {/* Driver hero */}
        <div className="relative rounded-2xl overflow-hidden mb-8 border border-border bg-surface">
          <div
            className="absolute left-0 top-0 bottom-0 w-1.5"
            style={{ backgroundColor: teamColor }}
          />
          <div className="p-6 pl-8">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
            ) : (
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl font-extrabold text-text">
                      {driver?.first_name} {driver?.last_name}
                    </h1>
                    <span
                      className="text-4xl font-black font-mono"
                      style={{ color: teamColor }}
                    >
                      #{driver?.driver_number}
                    </span>
                  </div>
                  <p className="text-muted text-sm">{driver?.team_name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {driver?.country_code && (
                      <Badge color="default">{driver.country_code}</Badge>
                    )}
                    {driver?.acronym && (
                      <Badge color="default" className="font-mono">{driver.acronym}</Badge>
                    )}
                  </div>
                </div>

                <select
                  className="input w-auto text-sm"
                  value={season}
                  onChange={e => setSeason(+e.target.value)}
                >
                  {[2024, 2023].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-5">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-7 w-16" />
                  </div>
                </Card>
              ))
            : [
                { label: 'Points', value: driver?.points ?? '--', accent: true },
                { label: 'Wins', value: driver?.wins ?? '--' },
                { label: 'Podiums', value: driver?.podiums ?? '--' },
                { label: 'Fastest Laps', value: driver?.fastest_laps ?? '--' },
              ].map((s, i) => (
                <Card key={i} className="p-5">
                  <StatBlock {...s} />
                </Card>
              ))
          }
        </div>

        {/* Sessions participated */}
        <CardWithHeader title="Recent Races" subtitle={`${season} season`}>
          {!sessions ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Round</th>
                  <th>Race</th>
                  <th>Circuit</th>
                  <th>Date</th>
                  <th className="text-right">Details</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, i) => (
                  <tr key={s.session_key}>
                    <td className="text-muted font-mono text-xs">{i + 1}</td>
                    <td className="font-medium text-text">{s.meeting_name}</td>
                    <td className="text-muted text-xs">{s.circuit_short_name}</td>
                    <td className="text-muted text-xs">{formatDate(s.date_start)}</td>
                    <td className="text-right">
                      <Link
                        to={`/race-center/${s.session_key}`}
                        className="text-xs text-primary hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardWithHeader>
      </div>
    </AppLayout>
  );
}
