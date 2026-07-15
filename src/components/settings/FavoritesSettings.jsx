import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '../../services/resources';
import { SettingsCard } from './SettingsCard';
import { Skeleton } from '../ui/Skeleton';
import { LuX } from 'react-icons/lu';

export function FavoritesSettings() {
  const queryClient = useQueryClient();

  const { data: favDrivers, isLoading: favDriversLoading } = useQuery({
    queryKey: ['favorites', 'drivers'],
    queryFn: () => favoritesApi.getDrivers(),
    select: (r) => r.data?.data ?? [],
  });

  const { data: favTeams, isLoading: favTeamsLoading } = useQuery({
    queryKey: ['favorites', 'teams'],
    queryFn: () => favoritesApi.getTeams(),
    select: (r) => r.data?.data ?? [],
  });

  const removeFavDriver = useMutation({
    mutationFn: (num) => favoritesApi.removeDriver(num),
    onSuccess: () => queryClient.invalidateQueries(['favorites', 'drivers']),
  });

  const removeFavTeam = useMutation({
    mutationFn: (name) => favoritesApi.removeTeam(name),
    onSuccess: () => queryClient.invalidateQueries(['favorites', 'teams']),
  });

  return (
    <SettingsCard title="Favorites" description="Manage your favorite drivers and teams for quick access.">
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Drivers</h4>
          {favDriversLoading ? (
            <div className="space-y-2"><Skeleton className="h-10 w-full" /></div>
          ) : favDrivers?.length === 0 ? (
            <div className="p-4 bg-white/5 border border-white/5 rounded-lg text-sm text-muted text-center">No favorite drivers</div>
          ) : (
            <div className="border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5 bg-black/20">
              {favDrivers.map(f => (
                <div key={f.driver_number} className="flex items-center justify-between px-4 py-2.5 hover:bg-surface-2/50 group transition-colors">
                  <span className="text-sm font-medium text-text">#{f.driver_number}</span>
                  <button
                    className="p-1 rounded text-muted hover:text-error hover:bg-error/10 transition-all opacity-0 group-hover:opacity-100"
                    onClick={() => removeFavDriver.mutate(f.driver_number)}
                    title="Remove"
                  >
                    <LuX size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Teams</h4>
          {favTeamsLoading ? (
            <div className="space-y-2"><Skeleton className="h-10 w-full" /></div>
          ) : favTeams?.length === 0 ? (
            <div className="p-4 bg-white/5 border border-white/5 rounded-lg text-sm text-muted text-center">No favorite teams</div>
          ) : (
            <div className="border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5 bg-black/20">
              {favTeams.map(f => (
                <div key={f.team_name} className="flex items-center justify-between px-4 py-2.5 hover:bg-surface-2/50 group transition-colors">
                  <span className="text-sm font-medium text-text">{f.team_name}</span>
                  <button
                    className="p-1 rounded text-muted hover:text-error hover:bg-error/10 transition-all opacity-0 group-hover:opacity-100"
                    onClick={() => removeFavTeam.mutate(f.team_name)}
                    title="Remove"
                  >
                    <LuX size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SettingsCard>
  );
}
