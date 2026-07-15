import React, { useState } from 'react';
import Nav from '../Nav';
import TopBar from '../TopBar';

export default function Shell({ children }) {
  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileNav = () => setMobileOpen((o) => !o);
  const closeMobileNav = () => setMobileOpen(false);

  return (
    <div className="flex h-screen bg-bg overflow-hidden relative">
      {/* ── Floating Sidebar ───────────────────────────────────────────── */}
      <Nav mobileOpen={mobileOpen} onCloseMobile={closeMobileNav} />

      {/* ── Content column ─────────────────────────────────────────────── */}
      {/* Left padding accommodates the fixed sidebar on desktop (24px margin + 88px width + 18px gap = 130px) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden md:pl-[130px] transition-all duration-300">
        <div className="max-w-6xl mx-auto w-full px-6 flex flex-col h-full">
          <TopBar onMenuClick={toggleMobileNav} />

          {/* Scrollable page content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
