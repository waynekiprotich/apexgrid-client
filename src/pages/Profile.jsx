import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '../layouts';
import { profileApi, dashboardsApi, favoritesApi } from '../services/resources';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardWithHeader } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/StateViews';
import { PageHeader } from '../components/ui/PageHeader';
import { formatDateTime } from '../utils/formatters';
import { LuTrash2, LuPencil, LuCheck, LuX } from 'react-icons/lu';

export default function Profile() {
  const { logout, updatePassword, updateEmail, deleteUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Profile state
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileError, setProfileError] = useState('');
  
  // Password state
  const [editingPassword, setEditingPassword] = useState(false);
  const [passForm, setPassForm] = useState({ current: '', new: '', confirm: '' });
  const [passError, setPassError] = useState('');

  // Dashboard state
  const [editingDashboardId, setEditingDashboardId] = useState(null);
  const [dashboardRenameValue, setDashboardRenameValue] = useState('');

  // ─── Queries ─────────────────────────────────────────────────────────────────
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.get(),
    select: (r) => r.data?.data,
    onSuccess: (d) => { 
      if (d?.username) setUsername(d.username); 
      if (d?.email) setEmail(d.email); 
    },
  });

  const { data: dashboards, isLoading: dashLoading } = useQuery({
    queryKey: ['dashboards'],
    queryFn: () => dashboardsApi.getAll(),
    select: (r) => r.data?.data ?? [],
  });

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

  // ─── Mutations ───────────────────────────────────────────────────────────────
  const updateProfileMutation = useMutation({
    mutationFn: async ({ username, email, oldEmail }) => {
      // If email changed, update in Firebase first
      if (email && email !== oldEmail) {
        await updateEmail(email);
      }
      return profileApi.patch({ username, email });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      setEditing(false);
      setProfileError('');
    },
    onError: (err) => {
      if (err?.code === 'auth/requires-recent-login') {
        setProfileError('Please sign out and sign back in to change your email.');
      } else {
        setProfileError(err?.response?.data?.error?.message || err?.message || 'Failed to update profile.');
      }
    }
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async ({ password }) => {
      await updatePassword(password);
    },
    onSuccess: () => {
      setEditingPassword(false);
      setPassForm({ current: '', new: '', confirm: '' });
      setPassError('');
    },
    onError: (err) => {
      if (err?.code === 'auth/requires-recent-login') {
        setPassError('Please sign out and sign back in to change your password.');
      } else {
        setPassError(err?.message || 'Failed to update password.');
      }
    }
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      await profileApi.deleteAccount();
      await deleteUser();
    },
    onSuccess: () => {
      navigate('/login');
    },
    onError: (err) => {
      console.error('Failed to delete account:', err);
      alert(err?.code === 'auth/requires-recent-login' 
        ? 'Please sign out and sign back in to delete your account.' 
        : 'Failed to delete account.');
    }
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

  const removeFavDriver = useMutation({
    mutationFn: (num) => favoritesApi.removeDriver(num),
    onSuccess: () => queryClient.invalidateQueries(['favorites', 'drivers']),
  });

  const removeFavTeam = useMutation({
    mutationFn: (name) => favoritesApi.removeTeam(name),
    onSuccess: () => queryClient.invalidateQueries(['favorites', 'teams']),
  });

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleSaveProfile = () => {
    updateProfileMutation.mutate({ username, email, oldEmail: profile?.email });
  };

  const handleSavePassword = () => {
    setPassError('');
    if (passForm.new !== passForm.confirm) {
      setPassError('New passwords do not match');
      return;
    }
    if (passForm.new.length < 8) {
      setPassError('Password must be at least 8 characters');
      return;
    }
    updatePasswordMutation.mutate({ password: passForm.new });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      deleteAccountMutation.mutate();
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
        <PageHeader title="Profile" subtitle="Account settings and preferences" />

        {/* ── Account info ────────────────────────────────────────────────── */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary text-xl font-black shrink-0">
              {(profile?.username?.[0] ?? 'U').toUpperCase()}
            </div>
            <div>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3.5 w-48" />
                </div>
              ) : (
                <>
                  <p className="font-bold text-text text-lg">{profile?.username}</p>
                  <p className="text-sm text-muted">{profile?.email}</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Edit Profile */}
            {editing ? (
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-xs text-muted mb-1">Username</label>
                  <input
                    className="input"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Email</label>
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                {profileError && (
                  <p className="text-xs text-error">{profileError}</p>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    className="btn-primary"
                    onClick={handleSaveProfile}
                    disabled={updateProfileMutation.isLoading}
                  >
                    {updateProfileMutation.isLoading ? 'Saving...' : 'Save changes'}
                  </button>
                  <button className="btn-ghost" onClick={() => {
                    setEditing(false);
                    setUsername(profile?.username || '');
                    setEmail(profile?.email || '');
                  }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn-outline text-sm" onClick={() => setEditing(true)}>
                Edit profile
              </button>
            )}

            <hr className="border-border" />

            {/* Change Password */}
            {editingPassword ? (
              <div className="space-y-4 max-w-sm">
                <h4 className="text-sm font-semibold text-text">Change Password</h4>
                <div>
                  <label className="block text-xs text-muted mb-1">New Password</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="8+ characters"
                    value={passForm.new}
                    onChange={e => setPassForm({ ...passForm, new: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Confirm New Password</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="••••••••"
                    value={passForm.confirm}
                    onChange={e => setPassForm({ ...passForm, confirm: e.target.value })}
                  />
                </div>
                {passError && (
                  <div className="text-xs text-error bg-error/10 border border-error/20 rounded-lg px-3 py-2">
                    {passError}
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    className="btn-primary"
                    onClick={handleSavePassword}
                    disabled={updatePasswordMutation.isLoading}
                  >
                    {updatePasswordMutation.isLoading ? 'Updating...' : 'Update password'}
                  </button>
                  <button className="btn-ghost" onClick={() => {
                    setEditingPassword(false);
                    setPassError('');
                    setPassForm({ current: '', new: '', confirm: '' });
                  }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn-outline text-sm" onClick={() => setEditingPassword(true)}>
                Change password
              </button>
            )}
          </div>
        </Card>

        {/* ── Saved Dashboards ────────────────────────────────────────────── */}
        <div className="mb-6">
          <CardWithHeader title="Saved Dashboards" subtitle={`${dashboards?.length ?? 0} saved`}>
            {dashLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : dashboards?.length === 0 ? (
              <div className="px-5 py-8">
                <EmptyState icon="📊" title="No saved dashboards" description="Save a dashboard configuration to recall it later." />
              </div>
            ) : (
              <div className="divide-y divide-border">
                {dashboards.map(d => (
                  <div key={d.id} className="flex items-center gap-3 px-5 py-3 group hover:bg-surface-2/50 transition-colors">
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
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
          </CardWithHeader>
        </div>

        {/* ── Manage Favorites ─────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <CardWithHeader title="Favorite Drivers" subtitle={`${favDrivers?.length ?? 0} saved`}>
            {favDriversLoading ? (
               <div className="p-4 space-y-3"><Skeleton className="h-8 w-full" /></div>
            ) : favDrivers?.length === 0 ? (
               <div className="p-5 text-center text-sm text-muted">No favorite drivers</div>
            ) : (
              <div className="divide-y divide-border">
                {favDrivers.map(f => (
                  <div key={f.driver_number} className="flex items-center justify-between px-5 py-2.5 hover:bg-surface-2/50 group">
                    <span className="text-sm font-medium text-text">#{f.driver_number}</span>
                    <button
                      className="p-1 text-muted opacity-0 group-hover:opacity-100 hover:text-error transition-all"
                      onClick={() => removeFavDriver.mutate(f.driver_number)}
                      title="Remove"
                    >
                      <LuX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardWithHeader>

          <CardWithHeader title="Favorite Teams" subtitle={`${favTeams?.length ?? 0} saved`}>
             {favTeamsLoading ? (
               <div className="p-4 space-y-3"><Skeleton className="h-8 w-full" /></div>
            ) : favTeams?.length === 0 ? (
               <div className="p-5 text-center text-sm text-muted">No favorite teams</div>
            ) : (
              <div className="divide-y divide-border">
                {favTeams.map(f => (
                  <div key={f.team_name} className="flex items-center justify-between px-5 py-2.5 hover:bg-surface-2/50 group">
                    <span className="text-sm font-medium text-text">{f.team_name}</span>
                    <button
                      className="p-1 text-muted opacity-0 group-hover:opacity-100 hover:text-error transition-all"
                      onClick={() => removeFavTeam.mutate(f.team_name)}
                      title="Remove"
                    >
                      <LuX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardWithHeader>
        </div>

        {/* ── Danger zone ─────────────────────────────────────────────────── */}
        <div className="mt-8 card p-5 border-error/30 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
          <div>
            <h3 className="text-sm font-semibold text-text mb-1">Sign out</h3>
            <p className="text-xs text-muted mb-4 sm:mb-0">
              You'll need to sign back in to access your favorites and saved dashboards.
            </p>
          </div>
          <button className="btn btn-outline hover:bg-surface-2 transition-colors shrink-0" onClick={handleLogout}>
            Sign out
          </button>
        </div>

        <div className="mt-6 card p-5 border-error/50 bg-error/5">
          <h3 className="text-sm font-semibold text-error mb-1">Delete Account</h3>
          <p className="text-xs text-error/80 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button 
            className="btn bg-error/10 text-error hover:bg-error hover:text-white transition-colors border border-error/20" 
            onClick={handleDeleteAccount}
            disabled={deleteAccountMutation.isLoading}
          >
            {deleteAccountMutation.isLoading ? 'Deleting...' : 'Delete account'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
