import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '../layouts';
import { favoritesApi } from '../services/resources';
import { Card, TeamColorBar } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/StateViews';
import { PageHeader } from '../components/ui/PageHeader';
import { getTeamColor } from '../utils/formatters';

function XIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function Favorites() {
  const queryClient = useQueryClient();

  const { data: favDrivers, isLoading: driversLoading } = useQuery({
    queryKey: ['favorites', 'drivers'],
    queryFn: () => favoritesApi.getDrivers(),
    select: (r) => r.data?.data ?? [],
  });

  const { data: favTeams, isLoading: teamsLoading } = useQuery({
    queryKey: ['favorites', 'teams'],
    queryFn: () => favoritesApi.getTeams(),
    select: (r) => r.data?.data ?? [],
  });

  const removeDriver = useMutation({
    mutationFn: (n) => favoritesApi.removeDriver(n),
    onSuccess: () => queryClient.invalidateQueries(['favorites', 'drivers']),
  });

  const removeTeam = useMutation({
    mutationFn: (n) => favoritesApi.removeTeam(n),
    onSuccess: () => queryClient.invalidateQueries(['favorites', 'teams']),
  });

  return (
    <AppLayout>
      <div className="py-8 animate-fade-in">
        <PageHeader title="Favorites" subtitle="Your saved drivers and teams" />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Favorite Drivers */}
          <div>
            <h2 className="text-sm font-semibold text-text mb-4">
              Favorite Drivers
              <span className="ml-2 text-xs text-muted font-normal">
                ({favDrivers?.length ?? 0})
              </span>
            </h2>
            {driversLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-4 flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : favDrivers?.length === 0 ? (
              <EmptyState
                icon="🏎️"
                title="No favorite drivers"
                description="Browse drivers and star the ones you follow"
                action={<Link to="/drivers" className="btn-outline text-sm">Browse Drivers</Link>}
              />
            ) : (
              <div className="space-y-2">
                {favDrivers.map(fav => {
                  const color = getTeamColor(fav.team_name);
                  return (
                    <Card key={fav.driver_number} className="p-4 flex items-center gap-3">
                      <TeamColorBar color={color} className="h-8" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text text-sm">
                          Driver #{fav.driver_number}
                        </p>
                        <p className="text-xs text-muted">Added to favorites</p>
                      </div>
                      <Link
                        to={`/drivers/${fav.driver_number}`}
                        className="text-xs text-primary hover:underline mr-2"
                      >
                        View
                      </Link>
                      <button
                        className="p-1.5 rounded text-muted hover:text-error hover:bg-error/10 transition-colors"
                        onClick={() => removeDriver.mutate(fav.driver_number)}
                        title="Remove"
                      >
                        <XIcon />
                      </button>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Favorite Teams */}
          <div>
            <h2 className="text-sm font-semibold text-text mb-4">
              Favorite Teams
              <span className="ml-2 text-xs text-muted font-normal">
                ({favTeams?.length ?? 0})
              </span>
            </h2>
            {teamsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-4 flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="h-3.5 flex-1" />
                  </Card>
                ))}
              </div>
            ) : favTeams?.length === 0 ? (
              <EmptyState
                icon="🏭"
                title="No favorite teams"
                description="Browse teams and star the ones you follow"
                action={<Link to="/teams" className="btn-outline text-sm">Browse Teams</Link>}
              />
            ) : (
              <div className="space-y-2">
                {favTeams.map(fav => {
                  const color = getTeamColor(fav.team_name);
                  return (
                    <Card key={fav.team_name} className="p-4 flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                        style={{ backgroundColor: `${color}20`, color }}
                      >
                        {fav.team_name?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text text-sm truncate">{fav.team_name}</p>
                      </div>
                      <Link to="/teams" className="text-xs text-primary hover:underline mr-2">
                        View
                      </Link>
                      <button
                        className="p-1.5 rounded text-muted hover:text-error hover:bg-error/10 transition-colors"
                        onClick={() => removeTeam.mutate(fav.team_name)}
                        title="Remove"
                      >
                        <XIcon />
                      </button>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
