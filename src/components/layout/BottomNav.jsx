import React from 'react';
import { NavLink } from 'react-router-dom';
import { LuLayoutDashboard, LuUsers, LuCar, LuActivity, LuCalendar } from 'react-icons/lu';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: LuLayoutDashboard },
  { path: '/drivers', label: 'Drivers', icon: LuUsers },
  { path: '/teams', label: 'Teams', icon: LuCar },
  { path: '/sessions', label: 'Sessions', icon: LuCalendar },
  { path: '/analytics', label: 'Analytics', icon: LuActivity },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#111111]/95 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-2 z-50 pb-safe">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center justify-center w-full h-full gap-1 transition-colors min-w-[44px] min-h-[44px]
            ${isActive ? 'text-primary' : 'text-muted hover:text-white'}
          `}
        >
          <item.icon size={20} className={({ isActive }) => isActive ? 'drop-shadow-[0_0_8px_rgba(255,51,51,0.5)]' : ''} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
