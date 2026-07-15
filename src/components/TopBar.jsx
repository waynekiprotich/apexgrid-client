import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  LuSearch,
  LuBell,
  LuChevronDown,
  LuMenu,
  LuLogIn,
  LuLogOut,
  LuSettings,
  LuUsers,
  LuTimer,
  LuHeart
} from 'react-icons/lu';
import { useAuth } from '../contexts/AuthContext';
import { profileApi } from '../services/resources';
import Breadcrumb from './Breadcrumb';
import SearchBar from './Search/SearchBar';

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
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const queryClient = useQueryClient();

  // Pull profile when signed in — drives the avatar initials + name
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.get(),
    select: (r) => r.data?.data,
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000,
  });

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
    setDropdownOpen(false);
    queryClient.clear();
    await logout();
    navigate('/');
  };

  const initials = profile?.username
    ? profile.username.slice(0, 2).toUpperCase()
    : currentUser ? '?' : null;

  const displayName = profile?.username
    ? profile.username.length > 10
      ? profile.username.slice(0, 10) + '…'
      : profile.username
    : null;

  return (
    <header className="flex items-center justify-between px-6 h-[76px] mt-6 mb-2 rounded-shell bg-glass shadow-premium-panel shrink-0 z-40 relative">

      {/* Mobile Logo */}
      <Link to="/" className="md:hidden flex items-center gap-2 relative group" aria-label="ApexGrid Home">
        <div className="absolute inset-0 bg-primary/40 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <img 
          src="/favicon.svg" 
          alt="ApexGrid Logo" 
          className="w-10 h-10 relative z-10 drop-shadow-sm"
          loading="eager"
        />
      </Link>

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
        <div className="shrink-0 flex items-center justify-center min-w-[44px] min-h-[44px]">
          <SearchBar />
        </div>

        {/* Bell */}
        <div className="relative shrink-0 hidden sm:block" title="Notifications coming soon">
          <button
            className="flex items-center justify-center w-[44px] h-[44px] rounded-full text-muted hover:text-white hover:bg-white/10 hover:-translate-y-[2px] transition-all duration-250 ease-in-out active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            aria-label="Notifications"
            disabled
          >
            <LuBell size={18} />
          </button>
        </div>

        {/* User cluster */}
        {currentUser && initials ? (
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-1.5 py-1.5 pr-4 rounded-full min-h-[44px] bg-white/5 border border-white/5 hover:bg-white/10 hover:-translate-y-[2px] hover:shadow-lg transition-all duration-250 ease-in-out active:scale-95 group"
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
                  to="/favorites"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-text hover:bg-white/5 transition-colors"
                >
                  <LuHeart size={15} className="text-muted" />
                  Favorites
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-text hover:bg-white/5 transition-colors"
                >
                  <LuSettings size={15} className="text-muted" />
                  Settings
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
            className="flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-full bg-white/5 border border-white/5 text-sm font-semibold text-white hover:bg-white/10 hover:-translate-y-[2px] hover:shadow-lg transition-all duration-250 ease-in-out shrink-0 active:scale-95"
          >
            <LuLogIn size={15} className="text-muted" />
            <span className="hidden sm:inline">Sign in</span>
          </Link>
        )}
      </div>
    </header>
  );
}
