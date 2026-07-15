import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '../layouts';
import { driversApi, favoritesApi, teamsApi } from '../services/resources';
import { useAuth } from '../contexts/AuthContext';
import { Card, TeamColorBar } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState, EmptyState } from '../components/ui/StateViews';
import { PageHeader, FilterBar, SearchInput, SelectFilter } from '../components/ui/PageHeader';
import { getTeamColor } from '../utils/formatters';

export default function Drivers() {
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('All Teams');
  const [season, setSeason] = useState(2024);
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: drivers, isLoading, error, refetch } = useQuery({
    queryKey: ['drivers', { season }],
    queryFn: () => driversApi.getAll({ season }),
    select: (r) => r.data?.data ?? [],
  });

  const { data: teams } = useQuery({
    queryKey: ['teams', { season }],
    queryFn: () => teamsApi.getAll({ year: season }),
    select: (r) => r.data?.data ?? [],
  });

  const { data: favorites } = useQuery({
    queryKey: ['favorites', 'drivers'],
    queryFn: () => favoritesApi.getDrivers(),
    select: (r) => r.data?.data?.map(f => f.driver_number) ?? [],
    enabled: !!accessToken,
  });

  const addFavMutation = useMutation({
    mutationFn: (n) => favoritesApi.addDriver(n),
    onSuccess: () => queryClient.invalidateQueries(['favorites', 'drivers']),
  });
  const removeFavMutation = useMutation({
    mutationFn: (n) => favoritesApi.removeDriver(n),
    onSuccess: () => queryClient.invalidateQueries(['favorites', 'drivers']),
  });

  const filtered = (drivers ?? []).filter(d => {
    const matchesSearch = search === '' ||
      `${d.first_name} ${d.last_name} ${d.driver_number}`.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = teamFilter === 'All Teams' ||
      (d.team_name || '').toLowerCase().includes(teamFilter.toLowerCase());
    return matchesSearch && matchesTeam;
  });

  return (
    <AppLayout>
      <div className="py-8 animate-fade-in">
        <PageHeader
          title="Drivers"
          subtitle={`${filtered.length} driver${filtered.length !== 1 ? 's' : ''}`}
          action={
            <select className="input w-auto text-sm" value={season} onChange={e => setSeason(+e.target.value)}>
              {[2024, 2023].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          }
        />

        <FilterBar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search driver..." />
          <SelectFilter
            value={teamFilter}
            onChange={setTeamFilter}
            options={[
              { value: 'All Teams', label: 'All Teams' },
              ...(teams || []).map(t => ({ value: t.team_name, label: t.team_name }))
            ]}
          />
        </FilterBar>

        {error && <ErrorState message="Failed to load drivers" onRetry={refetch} />}

        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <Card key={i} className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </Card>
                ))
              : filtered.length === 0
              ? <EmptyState icon="🏎️" title="No drivers found" description="Try adjusting your filters" className="col-span-3" />
              : filtered.map(driver => {
                  const color = getTeamColor(driver.team_name);
                  const isFav = favorites?.includes(driver.driver_number);
                  return (
                    <Card key={driver.driver_number} hover className="p-6 flex gap-4 items-start group">
                      {/* Team color bar */}
                      <TeamColorBar color={color} className="h-12 mt-1" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link to={`/drivers/${driver.driver_number}`}>
                              <p className="font-bold text-text text-sm hover:text-primary transition-colors">
                                {driver.first_name} {driver.last_name}
                              </p>
                            </Link>
                            <p className="text-xs text-muted mt-0.5">{driver.team_name}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className="text-lg font-black font-mono"
                              style={{ color }}
                            >
                              {driver.driver_number}
                            </span>
                            {accessToken && (
                              <button
                                className={`p-1 rounded transition-colors ${
                                  isFav ? 'text-yellow-400' : 'text-muted hover:text-yellow-400'
                                }`}
                                onClick={() =>
                                  isFav
                                    ? removeFavMutation.mutate(driver.driver_number)
                                    : addFavMutation.mutate(driver.driver_number)
                                }
                                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                              >
                                <svg className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>

                        {driver.country_code && (
                          <p className="text-xs text-muted mt-2 font-mono">{driver.country_code}</p>
                        )}
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
