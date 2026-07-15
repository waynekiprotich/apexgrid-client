import React from 'react';
import Shell from '../components/layout/Shell';

// Layout for main app pages (with sidebar)
export const AppLayout = ({ children }) => <Shell>{children}</Shell>;

// Layout for auth pages (centered, no sidebar)
export const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-bg flex items-center justify-center p-4">
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-glow-red">
          <span className="text-white font-black text-base">AG</span>
        </div>
        <div>
          <span className="font-bold text-text text-lg">ApexGrid</span>
          <p className="text-xs text-muted">F1 Analytics Platform</p>
        </div>
      </div>
      {children}
    </div>
  </div>
);
