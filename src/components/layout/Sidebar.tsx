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
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "w-72 h-screen sidebar-gradient sticky top-0 flex flex-col p-5 overflow-y-auto transition-all duration-300 z-50 shadow-lg shadow-slate-200/60",
        "md:translate-x-0",
        mobileOpen ? "fixed translate-x-0" : "fixed -translate-x-full md:translate-x-0"
      )}>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg neon-primary vibrant-indigo">
              <img src="/logo.png" alt="Vendhan Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-display font-black text-lg leading-tight text-primary tracking-tight">
                VENDHAN
              </h1>
              <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">Sports Academy</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-2 rounded-xl bg-slate-50 hover:bg-slate-100 touch-target transition-colors border border-slate-200"
            aria-label="Close menu"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose?.()}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative mobile-nav-item",
                isActive 
                  ? "bg-primary/10 text-primary font-bold border border-primary/20" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-primary"
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill" 
                      className="absolute left-0 w-1.5 h-7 bg-primary rounded-full" 
                    />
                  )}
                  <item.icon size={20} className={cn(
                    "transition-colors", 
                    isActive ? "text-primary" : "text-slate-400 group-hover:text-primary"
                  )} />
                  <span className="text-sm font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-slate-200">
          {isAdmin ? (
            <div className="p-4 bg-primary/10 rounded-2xl text-primary surface border border-primary/20 shadow-sm">
              <p className="text-[10px] text-primary/70 font-bold uppercase tracking-widest mb-2">Admin Account</p>
              <p className="font-bold text-sm text-slate-800 mb-3">Coach Richards</p>
              <button 
                onClick={() => { localStorage.removeItem('auth'); window.location.reload(); }}
                className="w-full bg-slate-50 hover:bg-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-slate-200 hover:border-primary/30 text-slate-700 touch-target"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              onClick={() => onClose?.()}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-dashed border-primary/30 text-primary hover:border-primary hover:bg-primary/5 transition-all group touch-target"
            >
              <UserCog size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-wider">Admin Login</span>
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
}
