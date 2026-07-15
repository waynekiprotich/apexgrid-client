import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { profileApi } from '../../services/resources';
import { SettingsCard } from './SettingsCard';
import { Skeleton } from '../ui/Skeleton';

export function ProfileSettings() {
  const { updateEmail, updatePassword } = useAuth();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileError, setProfileError] = useState('');

  const [editingPassword, setEditingPassword] = useState(false);
  const [passForm, setPassForm] = useState({ current: '', new: '', confirm: '' });
  const [passError, setPassError] = useState('');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.get(),
    select: (r) => r.data?.data,
    onSuccess: (d) => {
      if (d?.username) setUsername(d.username);
      if (d?.email) setEmail(d.email);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async ({ username, email, oldEmail }) => {
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

  const initial = (profile?.username?.[0] ?? 'U').toUpperCase();

  return (
    <SettingsCard title="Profile Information" description="Update your account details and profile identity.">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8">
        <div className="relative group shrink-0">
          <div className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary text-3xl font-black shadow-glow-red transition-all">
            {initial}
          </div>
          <button className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-medium text-white transition-opacity backdrop-blur-sm">
            Change
          </button>
        </div>
        
        <div className="flex-1 space-y-1">
          {isLoading ? (
            <div className="space-y-2">
               <Skeleton className="h-5 w-32" />
               <Skeleton className="h-3.5 w-48" />
            </div>
          ) : (
            <>
              <p className="font-bold text-text text-lg">{profile?.username}</p>
              <p className="text-sm text-muted">{profile?.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                  Member
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
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
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save changes'}
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

        <hr className="divider" />

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
                disabled={updatePasswordMutation.isPending}
              >
                {updatePasswordMutation.isPending ? 'Updating...' : 'Update password'}
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
    </SettingsCard>
  );
}
