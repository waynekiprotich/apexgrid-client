import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '../layouts';
import { sessionsApi } from '../services/resources';
import { Card, CardWithHeader, Badge, TyreBadge } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState, EmptyState } from '../components/ui/StateViews';
import { PageHeader, SelectFilter } from '../components/ui/PageHeader';
import { formatLapTime, getTeamColor } from '../utils/formatters';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend
} from 'recharts';

export default function Analytics() {
  const [sessionKey, setSessionKey] = useState(null);
  const [activeTab, setActiveTab] = useState('laps');

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions', { season: 2024 }],
    queryFn: () => sessionsApi.getAll({ season: 2024 }),
    select: (r) => (r.data?.data ?? []).filter(s => s.session_name === 'Race'),
    onSuccess: (data) => {
      if (!sessionKey && data.length > 0) {
        setSessionKey(data[0].session_key);
      }
    }
  });

  // Effect to handle the default selection if onSuccess doesn't fire when cached
  React.useEffect(() => {
    if (sessions && sessions.length > 0 && !sessionKey) {
      setSessionKey(sessions[0].session_key);
    }
  }, [sessions, sessionKey]);

  const { data: laps, isLoading: lapsLoading } = useQuery({
    queryKey: ['laps', sessionKey],
    queryFn: () => sessionsApi.getLaps(sessionKey),
    select: (r) => r.data?.data ?? [],
    enabled: !!sessionKey,
  });

  const { data: pitStops } = useQuery({
    queryKey: ['pitstops', sessionKey],
    queryFn: () => sessionsApi.getPitStops(sessionKey),
    select: (r) => r.data?.data ?? [],
    enabled: !!sessionKey,
  });

  const { data: tyres } = useQuery({
    queryKey: ['tyres', sessionKey],
    queryFn: () => sessionsApi.getTyres(sessionKey),
    select: (r) => r.data?.data ?? [],
    enabled: !!sessionKey,
  });

  // Process lap data for charts
  const drivers = [...new Set((laps ?? []).map(l => l.driver_number))].slice(0, 5);
  const CHART_COLORS = ['#e10600', '#00d2be', '#ff8000', '#3671c6', '#22c55e'];

  // Lap time scatter data
  const scatterData = drivers.flatMap((dn, di) =>
    (laps ?? [])
      .filter(l => l.driver_number === dn && l.lap_duration && l.lap_duration < 200)
      .map(l => ({
        driver: `#${dn}`,
        lap: l.lap_number,
        time: parseFloat(l.lap_duration.toFixed(3)),
        color: CHART_COLORS[di % CHART_COLORS.length],
      }))
  );

  // Pit stop bar chart
  const pitData = (pitStops ?? [])
    .filter(p => p.pit_duration)
    .sort((a, b) => a.pit_duration - b.pit_duration)
    .slice(0, 10)
    .map(p => ({
      driver: `#${p.driver_number}`,
      duration: parseFloat(p.pit_duration.toFixed(2)),
    }));

  const tabs = [
    { id: 'laps', label: 'Lap Times' },
    { id: 'pitstops', label: 'Pit Stops' },
    { id: 'tyres', label: 'Tyre Strategy' },
  ];

  return (
    <AppLayout>
      <div className="py-8 animate-fade-in">
        <PageHeader
          title="Analytics"
          subtitle="Session performance analysis"
          action={
            <SelectFilter
              value={sessionKey || ''}
              onChange={setSessionKey}
              options={sessions ? sessions.map(s => ({ label: s.meeting_name, value: s.session_key })) : []}
            />
          }
        />

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === t.id
                  ? 'border-primary text-text'
                  : 'border-transparent text-muted hover:text-text'
              }`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Lap Times scatter */}
        {activeTab === 'laps' && (
          <Card>
            <div className="p-5">
              <h3 className="text-sm font-semibold text-text mb-1">Lap Time Distribution</h3>
              <p className="text-xs text-muted mb-5">Each dot is a single lap. Filtered to reasonable lap times (&lt;200s).</p>
              {lapsLoading ? (
                <Skeleton className="h-72 w-full" />
              ) : scatterData.length === 0 ? (
                <EmptyState icon="📊" title="No lap data" description="This session may not have data yet" />
              ) : (
                <>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {drivers.map((dn, i) => (
                      <div key={dn} className="flex items-center gap-1.5 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                        <span className="text-muted font-mono">#{dn}</span>
                      </div>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={340}>
                    <ScatterChart margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="lap" name="Lap" tick={{ fontSize: 11, fill: '#737373' }} label={{ value: 'Lap', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#737373' }} />
                      <YAxis dataKey="time" name="Time (s)" tick={{ fontSize: 11, fill: '#737373' }} domain={['auto', 'auto']} />
                      <Tooltip
                        contentStyle={{ background: '#161616', border: '1px solid #262626', borderRadius: 8, fontSize: 12 }}
                        formatter={(val, name) => [name === 'time' ? `${val}s` : val, name]}
                      />
                      {drivers.map((dn, di) => (
                        <Scatter
                          key={dn}
                          name={`#${dn}`}
                          data={scatterData.filter(d => d.driver === `#${dn}`)}
                          fill={CHART_COLORS[di % CHART_COLORS.length]}
                          opacity={0.7}
                        />
                      ))}
                    </ScatterChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Pit Stops */}
        {activeTab === 'pitstops' && (
          <Card>
            <div className="p-5">
              <h3 className="text-sm font-semibold text-text mb-1">Pit Stop Durations</h3>
              <p className="text-xs text-muted mb-5">Sorted by duration. Top 10 fastest stops.</p>
              {pitData.length === 0 ? (
                <EmptyState icon="🔧" title="No pit stop data" description="Data may not be available yet" />
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={pitData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                    <XAxis dataKey="driver" tick={{ fontSize: 11, fill: '#737373' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#737373' }} domain={[0, 'dataMax + 1']} />
                    <Tooltip
                      contentStyle={{ background: '#161616', border: '1px solid #262626', borderRadius: 8, fontSize: 12 }}
                      formatter={(val) => [`${val}s`, 'Duration']}
                    />
                    <Bar dataKey="duration" fill="#e10600" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        )}

        {/* Tyre Strategy */}
        {activeTab === 'tyres' && (
          <Card>
            <div className="p-5">
              <h3 className="text-sm font-semibold text-text mb-1">Tyre Usage</h3>
              <p className="text-xs text-muted mb-5">Compounds used per driver this session.</p>
              {!tyres || tyres.length === 0 ? (
                <EmptyState icon="🏎️" title="No tyre data" description="Data may not be available yet" />
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Driver</th>
                      <th>Compound</th>
                      <th>Lap Start</th>
                      <th>New</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tyres.slice(0, 30).map((t, i) => (
                      <tr key={i}>
                        <td className="font-mono font-bold text-text">#{t.driver_number}</td>
                        <td><TyreBadge compound={t.compound} /></td>
                        <td className="text-muted font-mono text-xs">{t.lap_start ?? '--'}</td>
                        <td className="text-muted text-xs">{t.new ? '✓ New' : 'Used'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
