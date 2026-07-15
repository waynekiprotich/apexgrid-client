import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '../layouts';
import { standingsApi, favoritesApi } from '../services/resources';
import { useAuth } from '../contexts/AuthContext';
import { Card, TeamColorBar } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/StateViews';
import { PageHeader } from '../components/ui/PageHeader';
import { getTeamColor } from '../utils/formatters';

export default function Teams() {
  const [season, setSeason] = useState(2024);
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: constructors, isLoading, error, refetch } = useQuery({
    queryKey: ['standings', 'constructors', season],
    queryFn: () => standingsApi.constructors({ season }),
    select: (r) => r.data?.data ?? [],
  });

  const { data: favorites } = useQuery({
    queryKey: ['favorites', 'teams'],
    queryFn: () => favoritesApi.getTeams(),
    select: (r) => r.data?.data?.map(f => f.team_name) ?? [],
    enabled: !!accessToken,
  });

  const addFavMutation = useMutation({
    mutationFn: (name) => favoritesApi.addTeam(name),
    onSuccess: () => queryClient.invalidateQueries(['favorites', 'teams']),
  });
  const removeFavMutation = useMutation({
    mutationFn: (name) => favoritesApi.removeTeam(name),
    onSuccess: () => queryClient.invalidateQueries(['favorites', 'teams']),
  });

  const maxPoints = constructors?.[0]?.points || 1;

  return (
    <AppLayout>
      <div className="py-8 animate-fade-in">
        <PageHeader
          title="Teams"
          subtitle="Constructor standings"
          action={
            <select className="input w-auto text-sm" value={season} onChange={e => setSeason(+e.target.value)}>
              {[2024, 2023].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          }
        />

        {error && <ErrorState message="Failed to load teams" onRetry={refetch} />}

        {!error && (
          <div className="space-y-3">
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <Card key={i} className="p-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </Card>
                ))
              : constructors?.map((team, i) => {
                  const color = getTeamColor(team.team_name);
                  const pct = ((team.points || 0) / maxPoints) * 100;
                  const isFav = favorites?.includes(team.team_name);

                  return (
                    <Card key={team.team_name} hover className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Position */}
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black shrink-0"
                          style={{ backgroundColor: `${color}20`, color }}
                        >
                          {i + 1}
                        </div>

                        {/* Team info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-bold text-text">{team.team_name}</p>
                              <p className="text-xs text-muted">{team.wins ?? 0} wins this season</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-black text-text text-lg">
                                {team.points ?? '--'}
                              </span>
                              <span className="text-xs text-muted">pts</span>
                              {accessToken && (
                                <button
                                  className={`p-1 rounded transition-colors ${isFav ? 'text-yellow-400' : 'text-muted hover:text-yellow-400'}`}
                                  onClick={() =>
                                    isFav
                                      ? removeFavMutation.mutate(team.team_name)
                                      : addFavMutation.mutate(team.team_name)
                                  }
                                >
                                  <svg className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
            }
          </div>
        )}
      </div>
    </AppLayout>
  );
}
