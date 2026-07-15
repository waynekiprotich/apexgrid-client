import React from 'react';
import { CardWithHeader } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { getTeamColor } from '../../utils/formatters';

export default function ConstructorStandingsList({ data, isLoading }) {
  return (
    <CardWithHeader title="Constructor Standings">
      {isLoading ? (
        <div className="p-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {data?.slice(0, 6).map((t, i) => {
            const color = getTeamColor(t.team_name);
            const maxPts = data[0]?.points || 1;
            const pct = ((t.points || 0) / maxPts) * 100;
            return (
              <div key={t.team_name} className="px-6 py-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted w-4 font-mono">{i + 1}</span>
                    <span className="font-medium text-text">{t.team_name}</span>
                  </div>
                  <span className="font-mono font-bold text-text">{t.points ?? '--'}</span>
                </div>
                <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CardWithHeader>
  );
}
