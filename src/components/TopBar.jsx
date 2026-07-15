import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LuSearch,
  LuBell,
  LuChevronDown,
  LuMenu,
  LuLogIn,
  LuLogOut,
  LuSettings,
  LuUsers,
  LuTimer
} from 'react-icons/lu';
import { useAuth } from '../contexts/AuthContext';
import { profileApi } from '../services/resources';
import Breadcrumb from './Breadcrumb';

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ Icon, label, value, valueClass = '' }) {
  return (
    <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs whitespace-nowrap transition-all duration-250 ease-in-out hover:-translate-y-[2px] hover:bg-white/10 hover:shadow-lg cursor-default">
      <Icon size={13} className="text-muted shrink-0" />
      <span className="text-muted">{label}</span>
      <span className={`font-mono font-bold text-white ${valueClass}`}>{value}</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TopBar({ onMenuClick }) {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Pull profile when signed in — drives the avatar initials + name
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.get(),
    select: (r) => r.data?.data,
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  });

  // ⌘K / Ctrl+K → focus search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = profile?.username
    ? profile.username.slice(0, 2).toUpperCase()
    : accessToken ? '?' : null;

  const displayName = profile?.username
    ? profile.username.length > 10
      ? profile.username.slice(0, 10) + '…'
      : profile.username
    : null;

  return (
    <header className="flex items-center justify-between px-6 h-[76px] mt-6 mb-2 rounded-shell bg-glass shadow-premium-panel shrink-0 z-40 relative">

      {/* Mobile Menu Trigger */}
      <button
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors shrink-0"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <LuMenu size={18} />
      </button>

      {/* ── Left: Stat pills ─────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <StatPill Icon={LuUsers}  label="Drivers"    value="20" />
        <StatPill Icon={LuTimer}  label="Data Delay" value="~3s" />
      </div>

      {/* ── Center: Breadcrumb ───────────────────────────────────────────── */}
      <div className="flex-1 flex justify-center">
        <Breadcrumb />
      </div>

      {/* ── Right: Search, Bell, User ────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-end gap-4 shrink-0">
        
        {/* Search */}
        <div className="relative w-40 md:w-64 shrink-0 group">
          <LuSearch
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none group-focus-within:text-white transition-colors"
          />
          <input
            ref={searchRef}
            type="search"
            className="
              w-full h-10 bg-black/50 border border-white/5 rounded-full
              pl-10 pr-14 text-sm text-white placeholder:text-muted/60
              focus:outline-none focus:border-primary/50 focus:bg-black/70 focus:ring-1 focus:ring-primary/50
              transition-all duration-250 ease-in-out shadow-inner disabled:opacity-50 disabled:cursor-not-allowed
            "
            placeholder="Search coming soon..."
            disabled
            title="Search coming soon..."
          />
          <kbd className="
            absolute right-3 top-1/2 -translate-y-1/2
            text-[10px] text-muted-2 font-mono font-medium
            px-1.5 py-0.5 rounded-md border border-white/10 bg-white/5
            pointer-events-none shadow-sm
          ">
            ⌘K
          </kbd>
        </div>

        {/* Bell */}
        <div className="relative shrink-0 hidden sm:block" title="Notifications coming soon">
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full text-muted hover:text-white hover:bg-white/10 hover:-translate-y-[2px] transition-all duration-250 ease-in-out active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            aria-label="Notifications"
            disabled
          >
            <LuBell size={18} />
          </button>
        </div>

        {/* User cluster */}
        {accessToken && initials ? (
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-1.5 py-1.5 pr-4 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:-translate-y-[2px] hover:shadow-lg transition-all duration-250 ease-in-out active:scale-95 group"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shrink-0 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                {initials}
              </div>
              {/* Name + role */}
              <div className="hidden lg:block text-left leading-tight">
                <p className="text-sm font-semibold text-white">{displayName ?? '…'}</p>
                <p className="text-[10px] text-muted uppercase tracking-wider">Analyst</p>
              </div>
              <LuChevronDown size={14} className="text-muted hidden lg:block group-hover:text-white transition-colors" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#111111]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-premium-panel py-2 z-50 animate-fade-in origin-top-right">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-text hover:bg-white/5 transition-colors"
                >
                  <LuSettings size={15} className="text-muted" />
                  Profile Settings
                </Link>
                <div className="h-px bg-white/10 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                >
                  <LuLogOut size={15} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm font-semibold text-white hover:bg-white/10 hover:-translate-y-[2px] hover:shadow-lg transition-all duration-250 ease-in-out shrink-0 active:scale-95"
          >
            <LuLogIn size={15} className="text-muted" />
            <span className="hidden sm:inline">Sign in</span>
          </Link>
        )}
      </div>
    </header>
  );
}
