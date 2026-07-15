import React from 'react';
import { Link } from 'react-router-dom';
import Shell from '../components/layout/Shell';

// Layout for main app pages (with sidebar)
export const AppLayout = ({ children }) => <Shell>{children}</Shell>;

// Layout for auth pages (centered, no sidebar)
export const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-bg flex items-center justify-center p-4">
    <div className="w-full max-w-sm">
      {/* Logo */}
      <Link to="/" className="inline-flex items-center gap-3 mb-8 group relative" aria-label="ApexGrid Home">
        <div className="absolute inset-y-0 left-0 w-12 bg-primary/40 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <img 
          src="/favicon.svg" 
          alt="ApexGrid Logo" 
          className="w-12 h-12 relative z-10 drop-shadow-sm transition-transform duration-250 group-hover:scale-105"
          loading="eager"
        />
        <div className="relative z-10">
          <span className="font-bold text-text text-lg group-hover:text-primary transition-colors">ApexGrid</span>
          <p className="text-xs text-muted">F1 Analytics Platform</p>
        </div>
      </Link>
      {children}
    </div>
  </div>
);
