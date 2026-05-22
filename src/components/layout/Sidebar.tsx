import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Trophy,
  UserCog,
  Sun,
  CalendarDays,
  CalendarCheck,
  Calendar,
  Shield,
  Users,
  CreditCard,
  Wallet,
  ClipboardCheck,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const publicMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Trophy, label: 'Sports List', path: '/sports' },
  { icon: UserCog, label: 'Coach Profiles', path: '/coaches' },
  { icon: Sun, label: 'Summer Camp', path: '/summer-camp' },
  { icon: CalendarDays, label: 'Events', path: '/events' },
  { icon: CalendarCheck, label: 'Weekly Schedule', path: '/schedule' },
  { icon: ImageIcon, label: 'Gallery', path: '/gallery' },
  { icon: Calendar, label: 'Court Booking', path: '/court-booking' },
];

const adminMenuItems = [
  { icon: Shield, label: 'Admin Panel', path: '/admin' },
  { icon: Calendar, label: 'Court Bookings', path: '/admin/court-bookings' },
  { icon: CreditCard, label: 'Student Fees', path: '/fees' },
  { icon: CalendarCheck, label: 'Student Attendance', path: '/attendance/students' },
  { icon: Users, label: 'Student List', path: '/students/archive' },
  { icon: CalendarCheck, label: 'Coach Attendance', path: '/attendance/coaches' },
  { icon: Wallet, label: 'Coach Payroll', path: '/coaches/pay' },
];

interface SidebarProps {
  isAdmin: boolean;
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isAdmin, mobileOpen = false, onClose }: SidebarProps) {
  const menuItems = isAdmin ? [...publicMenuItems, ...adminMenuItems] : publicMenuItems;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-40 md:hidden"
          style={{
            background: 'rgba(124, 58, 237, 0.12)',
          }}
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "w-72 h-screen sticky top-0 flex flex-col p-5 overflow-y-auto transition-all duration-300 z-50 shadow-sm border-r border-card-border",
        "md:translate-x-0",
        mobileOpen ? "fixed translate-x-0" : "fixed -translate-x-full md:translate-x-0"
      )}>
        <div className="flex items-center justify-between mb-8 px-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
              <img src="/logo.png" alt="Vendhan Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-display font-black text-lg leading-tight text-primary tracking-tight">
                VENDHAN
              </h1>
              <p className="text-[9px] font-medium text-rose-500 uppercase tracking-widest">Sports Academy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-xl hover:bg-slate-50 touch-target transition-colors text-slate-400"
            aria-label="Close menu"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose?.()}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative mobile-nav-item text-[15px]",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-primary rounded-full"
                    />
                  )}
                  <item.icon size={18} className={cn(
                    "shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                  )} />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 pt-5 border-t border-card-border">
          {isAdmin ? (
            <div className="p-4 bg-slate-50 rounded-2xl text-slate-800 border border-card-border">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-2">Admin Account</p>
              <p className="font-semibold text-sm text-slate-800 mb-3">Coach Richards</p>
              <button
                onClick={() => { localStorage.removeItem('auth'); window.location.reload(); }}
                className="w-full bg-white hover:bg-slate-100 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all text-slate-600 border border-card-border touch-target"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              onClick={() => onClose?.()}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/5 transition-all text-primary touch-target"
            >
              <UserCog size={18} />
              <span className="text-sm font-semibold uppercase tracking-wide">Admin Login</span>
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
}
