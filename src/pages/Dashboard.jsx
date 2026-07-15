import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '../layouts';
import { standingsApi, sessionsApi } from '../services/resources';
import { Card, StatBlock, CardWithHeader } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { PageHeader } from '../components/ui/PageHeader';
import { formatDate } from '../utils/formatters';

import DriverStandingsTable from '../components/dashboard/DriverStandingsTable';
import ConstructorStandingsList from '../components/dashboard/ConstructorStandingsList';
import PointsChart from '../components/dashboard/PointsChart';

const SEASONS = [2024, 2023];

export default function Dashboard() {
  const [season, setSeason] = useState(2024);

  const { data: driverStandings, isLoading: dsLoading, error: dsError, refetch: dsRefetch } =
    useQuery({
      queryKey: ['standings', 'drivers', season],
      queryFn: () => standingsApi.drivers({ season }),
      select: (r) => r.data?.data ?? [],
    });

  const { data: constructorStandings, isLoading: csLoading } =
    useQuery({
      queryKey: ['standings', 'constructors', season],
      queryFn: () => standingsApi.constructors({ season }),
      select: (r) => r.data?.data ?? [],
    });

  const { data: sessions, isLoading: sessLoading } =
    useQuery({
      queryKey: ['sessions', { season }],
      queryFn: () => sessionsApi.getAll({ season }),
      select: (r) => r.data?.data ?? [],
    });

  const top5 = driverStandings?.slice(0, 5) ?? [];
  const chartData = top5.map((d) => ({
    name: d.last_name,
    pts: d.points ?? 0,
  }));

  return (
    <AppLayout>
      <div className="py-4 md:py-8 animate-fade-in space-y-4 md:space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="Season overview and standings"
          action={
            <select
              className="input w-auto text-sm"
              value={season}
              onChange={(e) => setSeason(Number(e.target.value))}
            >
              {SEASONS.map(s => <option key={s} value={s}>{s} Season</option>)}
            </select>
          }
        />

        {/* Key stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: 'Rounds', value: sessions?.length ?? '--', sub: `${season} season` },
            { label: 'Leader', value: driverStandings?.[0]?.last_name ?? '--', sub: 'Driver standings' },
            { label: 'Points leader', value: driverStandings?.[0]?.points ?? '--', sub: 'pts', accent: true },
            { label: 'Top team', value: constructorStandings?.[0]?.team_name?.split(' ').pop() ?? '--', sub: constructorStandings?.[0]?.points + ' pts' },
          ].map((stat, i) => (
            <Card key={i} className="p-6">
              {dsLoading || csLoading || sessLoading
                ? <div className="space-y-2"><Skeleton className="h-3 w-20" /><Skeleton className="h-7 w-28" /></div>
                : <StatBlock {...stat} />
              }
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Driver standings table */}
          <div className="lg:col-span-3 space-y-6 overflow-hidden">
            <PointsChart data={chartData} />
            <DriverStandingsTable 
              data={driverStandings} 
              isLoading={dsLoading} 
              error={dsError} 
              refetch={dsRefetch} 
              season={season} 
            />
          </div>

          <div className="lg:col-span-2 space-y-6 overflow-hidden">
            {/* Constructor standings */}
            <ConstructorStandingsList 
              data={constructorStandings} 
              isLoading={csLoading} 
            />

            {/* Session list */}
            <CardWithHeader title="Race Calendar" subtitle={`${season} rounds`}>
              <div className="divide-y divide-border max-h-80 overflow-y-auto">
                {sessLoading
                  ? Array.from({length:5}).map((_,i)=>(
                      <div key={i} className="px-6 py-4 space-y-1">
                        <Skeleton className="h-3 w-1/3"/><Skeleton className="h-3.5 w-2/3"/>
                      </div>
                    ))
                  : sessions?.filter(s => s.session_name === 'Race').map((s) => (
                      <div key={s.session_key} className="px-6 py-4 transition-colors hover:bg-white/5">
                        <p className="text-xs text-muted">{formatDate(s.date_start)}</p>
                        <p className="text-sm font-medium text-text">{s.meeting_name}</p>
                        <p className="text-xs text-muted">{s.circuit_short_name}</p>
                      </div>
                    ))
                }
              </div>
            </CardWithHeader>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
