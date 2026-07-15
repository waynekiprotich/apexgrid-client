import React from 'react';
import { CardWithHeader, TeamColorBar } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/StateViews';
import { getTeamColor } from '../../utils/formatters';

export default function DriverStandingsTable({ data, isLoading, error, refetch, season }) {
  return (
    <CardWithHeader title="Driver Standings" subtitle={`${season} season`}>
      {error ? (
        <ErrorState message="Failed to load standings" onRetry={refetch} />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-10 pl-6">#</th>
              <th>Driver</th>
              <th className="text-right">Points</th>
              <th className="text-right hidden md:table-cell pr-6">Wins</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    {[1,2,3,4].map(j => (
                      <td key={j} className="py-3 px-4"><Skeleton className="h-3.5 w-full" /></td>
                    ))}
                  </tr>
                ))
              : data?.map((d, i) => (
                  <tr key={d.driver_number}>
                    <td className="text-muted font-mono text-xs pl-6">{i + 1}</td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <TeamColorBar color={getTeamColor(d.team_name)} className="h-4" />
                        <div>
                          <p className="font-medium text-text text-sm">
                            {d.first_name} <span className="font-bold">{d.last_name}</span>
                          </p>
                          <p className="text-xs text-muted">{d.team_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right font-mono font-bold text-text">{d.points ?? '--'}</td>
                    <td className="text-right font-mono text-muted hidden md:table-cell pr-6">{d.wins ?? '--'}</td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      )}
    </CardWithHeader>
  );
}
