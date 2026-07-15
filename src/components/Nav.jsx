import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LuHouse,
  LuLayoutDashboard,
  LuUsers,
  LuBuilding2,
  LuCalendarDays,
  LuChartBar,
  LuStar,
  LuCircleHelp,
  LuSettings,
} from 'react-icons/lu';

// ─── Route manifest ────────────────────────────────────────────────────────────
const PRIMARY_NAV = [
  { to: '/',          label: 'Home',      Icon: LuHouse,           exact: true },
  { to: '/dashboard', label: 'Dashboard', Icon: LuLayoutDashboard          },
  { to: '/drivers',   label: 'Drivers',   Icon: LuUsers                    },
  { to: '/teams',     label: 'Teams',     Icon: LuBuilding2                },
  { to: '/sessions',  label: 'Sessions',  Icon: LuCalendarDays             },
  { to: '/analytics', label: 'Analytics', Icon: LuChartBar                },
  { to: '/favorites', label: 'Favorites', Icon: LuStar                     },
];

const BOTTOM_NAV = [
  { to: '#', label: 'Help (Coming soon)', Icon: LuCircleHelp, disabled: true },
  { to: '/settings', label: 'Settings', Icon: LuSettings   },
];

// ─── Single nav item with right-side tooltip ───────────────────────────────────
function NavItem({ to, label, Icon, exact = false, onClick, disabled = false }) {
  const Component = disabled ? 'div' : NavLink;
  const props = disabled ? {} : { to, end: exact, onClick };

  return (
    <div className="relative group/item w-full flex justify-center">
      <Component
        {...props}
        className={typeof Component === 'string' ? '' : ({ isActive }) =>
          `flex items-center justify-center w-[50px] h-[50px] rounded-full transition-all duration-250 ease-in-out active:scale-95 ${
            isActive
              ? 'bg-white/15 text-white shadow-[0_4px_16px_rgba(0,0,0,0.4)] scale-105 backdrop-blur-md border border-white/10'
              : 'text-[#888888] hover:text-white hover:bg-white/5 hover:-translate-y-0.5 hover:scale-105'
          }`
        }
        aria-label={label}
        {...(disabled ? {
          className: 'flex items-center justify-center w-[50px] h-[50px] rounded-full text-[#888888] opacity-50 cursor-not-allowed',
        } : {})}
      >
        <Icon size={22} strokeWidth={1.5} />
      </Component>

      {/* Tooltip — CSS only */}
      <div
        role="tooltip"
        className="
          pointer-events-none select-none
          absolute left-[70px] top-1/2 -translate-y-1/2
          px-3 py-1.5 rounded-lg z-[60]
          bg-[#1a1a1a] border border-white/10 shadow-xl
          text-xs font-medium text-white whitespace-nowrap
          opacity-0 translate-x-[-8px] scale-95
          group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/item:scale-100
          transition-all duration-250 origin-left ease-out
        "
      >
        {label}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Nav({ mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-6 bottom-6 w-[88px] rounded-[40px] z-50
          bg-[#111111]/70 backdrop-blur-2xl
          border border-white/5
          shadow-[0_0_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]
          flex flex-col items-center py-6
          transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
          md:translate-x-0 md:left-6
          ${mobileOpen ? 'translate-x-6' : '-translate-x-[120%]'}
        `}
        aria-label="Primary navigation"
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center w-[56px] h-[56px] shrink-0 mb-6">
          <div
            className="w-full h-full rounded-full flex items-center justify-center select-none shadow-[0_0_24px_rgba(225,6,0,0.5)] border border-white/10 transition-transform duration-250 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #e10600 0%, #9d0400 100%)',
            }}
          >
            <span className="text-white font-black text-lg tracking-tighter">AG</span>
          </div>
        </div>

        {/* Primary nav */}
        <nav className="flex-1 flex flex-col items-center gap-4 w-full">
          {PRIMARY_NAV.map(item => (
            <NavItem key={item.to} {...item} onClick={onCloseMobile} />
          ))}
        </nav>

        {/* Bottom utility nav */}
        <div className="flex flex-col items-center gap-4 w-full shrink-0 mt-4">
          <div className="w-10 h-px bg-white/10 mb-2" />

          {BOTTOM_NAV.map(item => (
            <NavItem key={item.to} {...item} onClick={onCloseMobile} />
          ))}
        </div>
      </aside>
    </>
  );
}
