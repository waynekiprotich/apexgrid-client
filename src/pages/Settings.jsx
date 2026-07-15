import React, { useState, useEffect } from 'react';
import { AppLayout } from '../layouts';
import { PageHeader } from '../components/ui/PageHeader';
import { LuUser, LuPalette, LuBell, LuLayoutDashboard, LuSearch, LuShield, LuLink, LuKeyboard, LuInfo } from 'react-icons/lu';

import { ProfileSettings } from '../components/settings/ProfileSettings';
import { AppearanceSettings } from '../components/settings/AppearanceSettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { DashboardSettings } from '../components/settings/DashboardSettings';
import { FavoritesSettings } from '../components/settings/FavoritesSettings';
import { SearchSettings } from '../components/settings/SearchSettings';
import { PrivacySettings } from '../components/settings/PrivacySettings';
import { ConnectedAccounts } from '../components/settings/ConnectedAccounts';
import { KeyboardShortcuts } from '../components/settings/KeyboardShortcuts';
import { AboutSection } from '../components/settings/AboutSection';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const TABS = [
    { id: 'profile', label: 'Profile', icon: LuUser, component: ProfileSettings },
    { id: 'appearance', label: 'Appearance', icon: LuPalette, component: AppearanceSettings },
    { id: 'notifications', label: 'Notifications', icon: LuBell, component: NotificationSettings },
    { id: 'dashboard', label: 'Dashboard', icon: LuLayoutDashboard, component: DashboardSettings },
    { id: 'favorites', label: 'Favorites', icon: LuLink, component: FavoritesSettings }, // LuLink as placeholder for favorites if needed, or star
    { id: 'search', label: 'Search', icon: LuSearch, component: SearchSettings },
    { id: 'privacy', label: 'Privacy', icon: LuShield, component: PrivacySettings },
    { id: 'accounts', label: 'Connected Accounts', icon: LuLink, component: ConnectedAccounts },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: LuKeyboard, component: KeyboardShortcuts },
    { id: 'about', label: 'About', icon: LuInfo, component: AboutSection },
  ];

  // For Mobile, we might want to just render all sections sequentially, or use tabs.
  // The user requested "Scrollable settings sections" for mobile, which implies a continuous scroll or a dedicated sub-page pattern.
  // Given "excellent spacing" and "minimal" we'll render a sidebar layout for desktop, and a continuous vertical list of sections for mobile.

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 animate-fade-in pb-safe">
        
        {/* Sticky Page Header */}
        <div className="sticky top-0 z-20 bg-bg/80 backdrop-blur-md pt-2 pb-4 mb-6 border-b border-white/5 flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-text tracking-tight">Settings</h1>
            <p className="text-sm text-muted mt-1">Manage your account, application preferences and experience.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="btn-ghost hidden sm:inline-flex text-xs h-9">Reset</button>
            <button className="btn-primary text-xs h-9 relative">
              Save Changes
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-bg animate-pulse"></span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Desktop Sidebar Settings Nav */}
          <aside className="hidden md:flex flex-col w-56 shrink-0 sticky top-32 space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full text-left
                    ${isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-white/5 hover:text-text'}
                  `}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 w-full max-w-3xl space-y-12 md:space-y-0">
            {isMobile ? (
              // Mobile: render all sections sequentially with big gaps
              <div className="space-y-12">
                {TABS.map(tab => (
                  <div key={tab.id} id={tab.id} className="scroll-mt-24">
                    <h2 className="text-lg font-bold text-text mb-4 pl-1 flex items-center gap-2">
                      <tab.icon size={18} className="text-primary" />
                      {tab.label}
                    </h2>
                    <tab.component />
                  </div>
                ))}
              </div>
            ) : (
              // Desktop: Render only active tab
              <div className="animate-fade-in">
                {TABS.map(tab => tab.id === activeTab && <tab.component key={tab.id} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
