import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '../layouts';
import { sessionsApi } from '../services/resources';
import { Card, Badge } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState, EmptyState } from '../components/ui/StateViews';
import { PageHeader, FilterBar, SearchInput, SelectFilter } from '../components/ui/PageHeader';
import { formatDate, getSessionLabel } from '../utils/formatters';

const SESSION_TYPES = [
  'All Types', 'Race', 'Qualifying', 'Sprint', 'Sprint Qualifying',
  'Practice 1', 'Practice 2', 'Practice 3'
];

const TYPE_BADGE_COLOR = {
  Race: 'red', Qualifying: 'blue', Sprint: 'yellow', 'Sprint Qualifying': 'yellow',
};

export default function Sessions() {
  const [season, setSeason] = useState(2024);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');

  const { data: sessions, isLoading, error, refetch } = useQuery({
    queryKey: ['sessions', { season }],
    queryFn: () => sessionsApi.getAll({ season }),
    select: (r) => r.data?.data ?? [],
  });

  const filtered = (sessions ?? []).filter(s => {
    const matchSearch = search === '' ||
      `${s.meeting_name} ${s.circuit_short_name}`.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All Types' || s.session_name === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <AppLayout>
      <div className="py-8 animate-fade-in">
        <PageHeader
          title="Sessions"
          subtitle={`${filtered.length} sessions`}
          action={
            <select className="input w-auto text-sm" value={season} onChange={e => setSeason(+e.target.value)}>
              {[2024, 2023].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          }
        />

        <FilterBar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search race or circuit..." />
          <SelectFilter
            value={typeFilter}
            onChange={setTypeFilter}
            options={SESSION_TYPES.map(t => ({ value: t, label: t }))}
          />
        </FilterBar>

        {error && <ErrorState message="Failed to load sessions" onRetry={refetch} />}

        {!error && (
          <>
            {isLoading ? (
              <Card>
                <table className="data-table">
                  <thead>
                    <tr>
                      {['Date', 'Race', 'Circuit', 'Type', ''].map(h => <th key={h}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i}>
                        {[1,2,3,4,5].map(j => (
                          <td key={j} className="py-3 px-4"><Skeleton className="h-3.5 w-full" /></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            ) : filtered.length === 0 ? (
              <EmptyState icon="📅" title="No sessions found" description="Try changing the filters" />
            ) : (
              <Card>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Race</th>
                      <th>Circuit</th>
                      <th>Type</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(s => (
                      <tr key={s.session_key}>
                        <td className="text-muted text-xs font-mono whitespace-nowrap">
                          {formatDate(s.date_start)}
                        </td>
                        <td className="font-medium text-text">{s.meeting_name}</td>
                        <td className="text-muted text-xs">{s.circuit_short_name}</td>
                        <td>
                          <Badge color={TYPE_BADGE_COLOR[s.session_name] || 'default'}>
                            {getSessionLabel(s.session_name)}
                          </Badge>
                        </td>
                        <td className="text-right">
                          <Link
                            to={`/race-center/${s.session_key}`}
                            className="btn-ghost text-xs px-3 py-1"
                          >
                            Open →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
