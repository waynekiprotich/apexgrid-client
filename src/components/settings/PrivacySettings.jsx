import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { profileApi } from '../../services/resources';
import { SettingsCard } from './SettingsCard';
import { SettingsToggle, SettingsSegmented } from './SettingsUI';

export function PrivacySettings() {
  const { deleteUser } = useAuth();
  const navigate = useNavigate();

  const [visibility, setVisibility] = useState('private');
  const [shareAnalytics, setShareAnalytics] = useState(false);

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      await profileApi.deleteAccount();
      await deleteUser();
    },
    onSuccess: () => navigate('/login'),
    onError: (err) => {
      console.error('Failed to delete account:', err);
      alert(err?.code === 'auth/requires-recent-login' 
        ? 'Please sign out and sign back in to delete your account.' 
        : 'Failed to delete account.');
    }
  });

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      deleteAccountMutation.mutate();
    }
  };

  const handleDownloadData = () => {
    alert("Preparing your data. You will receive an email shortly.");
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Privacy & Analytics" description="Control your profile visibility and data sharing.">
        <div className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-text mb-3">Profile Visibility</label>
            <SettingsSegmented
              options={[
                { label: 'Private', value: 'private' },
                { label: 'Public', value: 'public' },
              ]}
              value={visibility}
              onChange={setVisibility}
            />
            <p className="text-xs text-muted mt-2">
              Public profiles can be viewed by other ApexGrid users.
            </p>
          </div>

          <hr className="divider" />

          <SettingsToggle
            checked={shareAnalytics}
            onChange={setShareAnalytics}
            label="Share Anonymous Usage"
            description="Help us improve ApexGrid by sharing anonymous usage data and crash reports."
          />

          <hr className="divider" />

          <div>
            <h4 className="text-sm font-medium text-text mb-1">Download Data</h4>
            <p className="text-xs text-muted mb-4">Export a copy of your saved dashboards, favorites, and account data.</p>
            <button className="btn btn-outline" onClick={handleDownloadData}>
              Request Data Archive
            </button>
          </div>
          
        </div>
      </SettingsCard>

      <SettingsCard danger title="Danger Zone" description="Irreversible actions regarding your account.">
        <div className="flex flex-col sm:flex-row gap-6 justify-between sm:items-center">
          <div>
            <p className="text-xs text-error/80 mb-2">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <button 
            className="btn bg-error/10 text-error hover:bg-error hover:text-white transition-colors border border-error/20 shrink-0" 
            onClick={handleDeleteAccount}
            disabled={deleteAccountMutation.isPending}
          >
            {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete account'}
          </button>
        </div>
      </SettingsCard>
    </div>
  );
}
