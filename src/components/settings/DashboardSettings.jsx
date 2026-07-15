import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardsApi } from '../../services/resources';
import { SettingsCard } from './SettingsCard';
import { SettingsToggle, SettingsSegmented } from './SettingsUI';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/StateViews';
import { formatDateTime } from '../../utils/formatters';
import { LuTrash2, LuPencil, LuCheck, LuX } from 'react-icons/lu';

export function DashboardSettings() {
  const queryClient = useQueryClient();
  const [defaultPage, setDefaultPage] = useState('dashboard');
  
  // Widget toggles
  const [widgets, setWidgets] = useState({
    standings: true,
    constructors: true,
    sessions: true,
    weather: false,
    telemetry: false,
    calendar: true,
    comparison: false,
  });

  const toggleWidget = (k) => setWidgets(w => ({ ...w, [k]: !w[k] }));

  // Saved Dashboards state
  const [editingDashboardId, setEditingDashboardId] = useState(null);
  const [dashboardRenameValue, setDashboardRenameValue] = useState('');

  const { data: dashboards, isLoading: dashLoading } = useQuery({
    queryKey: ['dashboards'],
    queryFn: () => dashboardsApi.getAll(),
    select: (r) => r.data?.data ?? [],
  });

  const deleteDashboard = useMutation({
    mutationFn: (id) => dashboardsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['dashboards']),
  });

  const renameDashboard = useMutation({
    mutationFn: ({ id, body }) => dashboardsApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboards']);
      setEditingDashboardId(null);
    },
  });

  return (
    <div className="space-y-6">
      <SettingsCard title="Dashboard Preferences" description="Configure your default homepage and widgets.">
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-text mb-3">Default Homepage</label>
            <SettingsSegmented
              options={[
                { label: 'Dashboard', value: 'dashboard' },
                { label: 'Drivers', value: 'drivers' },
                { label: 'Teams', value: 'teams' },
                { label: 'Analytics', value: 'analytics' },
              ]}
              value={defaultPage}
              onChange={setDefaultPage}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-3">Visible Widgets</label>
            <div className="space-y-1">
              <SettingsToggle checked={widgets.standings} onChange={() => toggleWidget('standings')} label="Driver Standings" />
              <SettingsToggle checked={widgets.constructors} onChange={() => toggleWidget('constructors')} label="Constructor Standings" />
              <SettingsToggle checked={widgets.sessions} onChange={() => toggleWidget('sessions')} label="Recent Sessions" />
              <SettingsToggle checked={widgets.calendar} onChange={() => toggleWidget('calendar')} label="Race Calendar" />
              <SettingsToggle checked={widgets.weather} onChange={() => toggleWidget('weather')} label="Weather Forecast" />
              <SettingsToggle checked={widgets.telemetry} onChange={() => toggleWidget('telemetry')} label="Live Telemetry" disabled />
              <SettingsToggle checked={widgets.comparison} onChange={() => toggleWidget('comparison')} label="Team Comparison" disabled />
            </div>
            <p className="text-[10px] text-muted mt-2">Note: Drag-and-drop ordering is coming in a future update.</p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Saved Dashboards" description={`${dashboards?.length ?? 0} configuration${dashboards?.length !== 1 ? 's' : ''} saved`}>
        {dashLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : dashboards?.length === 0 ? (
          <div className="py-4">
            <EmptyState icon="📊" title="No saved dashboards" description="Save a dashboard configuration to recall it later." />
          </div>
        ) : (
          <div className="divide-y divide-border -mx-5 -mb-5 mt-2">
            {dashboards.map(d => (
              <div key={d.id} className="flex items-center gap-3 px-5 py-3.5 group hover:bg-surface-2/50 transition-colors">
                <div className="flex-1 min-w-0">
                  {editingDashboardId === d.id ? (
                    <input
                      autoFocus
                      className="input h-8 text-sm px-2 w-full max-w-xs mb-1"
                      value={dashboardRenameValue}
                      onChange={(e) => setDashboardRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && dashboardRenameValue.trim()) {
                          renameDashboard.mutate({ id: d.id, body: { dashboard_name: dashboardRenameValue.trim() } });
                        } else if (e.key === 'Escape') {
                          setEditingDashboardId(null);
                        }
                      }}
                    />
                  ) : (
                    <p className="font-medium text-text text-sm truncate">{d.dashboard_name}</p>
                  )}
                  <p className="text-xs text-muted">{formatDateTime(d.created_at)}</p>
                </div>
                <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  {editingDashboardId === d.id ? (
                    <>
                      <button
                        className="p-1.5 rounded text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => {
                          if (dashboardRenameValue.trim()) {
                            renameDashboard.mutate({ id: d.id, body: { dashboard_name: dashboardRenameValue.trim() } });
                          }
                        }}
                        title="Save"
                      >
                        <LuCheck size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded text-muted hover:bg-white/10 transition-colors"
                        onClick={() => setEditingDashboardId(null)}
                        title="Cancel"
                      >
                        <LuX size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      className="p-1.5 rounded text-muted hover:text-text hover:bg-white/10 transition-colors"
                      onClick={() => {
                        setEditingDashboardId(d.id);
                        setDashboardRenameValue(d.dashboard_name);
                      }}
                      title="Rename dashboard"
                    >
                      <LuPencil size={16} />
                    </button>
                  )}
                  <button
                    className="p-1.5 rounded text-muted hover:text-error hover:bg-error/10 transition-colors"
                    onClick={() => deleteDashboard.mutate(d.id)}
                    title="Delete dashboard"
                  >
                    <LuTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SettingsCard>
    </div>
  );
}
