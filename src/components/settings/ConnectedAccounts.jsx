import React from 'react';
import { SettingsCard } from './SettingsCard';
import { useAuth } from '../../contexts/AuthContext';
import { LuCheck, LuGithub } from 'react-icons/lu';
import { FcGoogle } from 'react-icons/fc';

export function ConnectedAccounts() {
  const { currentUser } = useAuth();
  
  // We can derive connected providers from Firebase currentUser.providerData
  const providers = currentUser?.providerData?.map(p => p.providerId) || [];
  
  const hasPassword = providers.includes('password');
  const hasGoogle = providers.includes('google.com');
  const hasGithub = providers.includes('github.com');

  return (
    <SettingsCard title="Connected Accounts" description="Manage your connected social login providers.">
      <div className="space-y-4">
        
        {/* Email / Password */}
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0">
              @
            </div>
            <div>
              <p className="text-sm font-medium text-text">Email / Password</p>
              <p className="text-xs text-muted">Core authentication</p>
            </div>
          </div>
          {hasPassword ? (
            <span className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
              <LuCheck size={14} /> Connected
            </span>
          ) : (
            <button className="btn-outline text-xs h-8 px-3">Connect</button>
          )}
        </div>

        {/* Google */}
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
              <FcGoogle size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-text">Google</p>
              <p className="text-xs text-muted">Sign in with Google</p>
            </div>
          </div>
          {hasGoogle ? (
            <span className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
              <LuCheck size={14} /> Connected
            </span>
          ) : (
            <button className="btn-outline text-xs h-8 px-3">Connect</button>
          )}
        </div>

        {/* GitHub */}
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg opacity-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text shrink-0">
              <LuGithub size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-text">GitHub</p>
              <p className="text-xs text-muted">Coming soon</p>
            </div>
          </div>
          <button className="btn-outline text-xs h-8 px-3" disabled>Connect</button>
        </div>

      </div>
    </SettingsCard>
  );
}
