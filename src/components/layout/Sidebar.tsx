import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Trophy, 
  UserCog, 
  Sun, 
  CalendarDays, 
  CalendarCheck,
  Shield,
  Users,
  CreditCard,
  Wallet,
  ClipboardCheck,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const publicMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Trophy, label: 'Sports List', path: '/sports' },
  { icon: UserCog, label: 'Coach Profiles', path: '/coaches' },
  { icon: CalendarCheck, label: 'Student Attendance', path: '/attendance/students' },
  { icon: Users, label: 'Student List', path: '/students/archive' },
  { icon: Sun, label: 'Summer Camp', path: '/summer-camp' },
  { icon: CalendarDays, label: 'Events', path: '/events' },
  { icon: CalendarCheck, label: 'Weekly Schedule', path: '/schedule' },
  { icon: ImageIcon, label: 'Gallery', path: '/gallery' },
];

const adminMenuItems = [
  { icon: Shield, label: 'Admin Panel', path: '/admin' },
  { icon: CreditCard, label: 'Student Fees', path: '/fees' },
  { icon: CalendarCheck, label: 'Coach Attendance', path: '/attendance/coaches' },
  { icon: Wallet, label: 'Coach Payroll', path: '/coaches/pay' },
];

interface SidebarProps {
  isAdmin: boolean;
}

export function Sidebar({ isAdmin }: SidebarProps) {
  const menuItems = isAdmin ? [...publicMenuItems, ...adminMenuItems] : publicMenuItems;

  return (
    <aside className="w-64 h-screen bg-white border-r border-sky-100 sticky top-0 flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-green-100">
          <img src="/input_file_0.png" alt="Vendhan Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="font-display font-black text-xl leading-tight text-sky-900 tracking-tight">
            VENDHAN
          </h1>
          <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Sports Academy</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
              isActive 
                ? "bg-purple-50 text-purple-600 font-bold" 
                : "text-slate-500 hover:bg-sky-50 hover:text-sky-600"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-purple-600 rounded-full" />}
                <item.icon size={20} className={cn("transition-colors", isActive ? "text-purple-600" : "group-hover:text-sky-600")} />
                <span className="text-sm">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 pt-6 border-t border-sky-50">
        {isAdmin ? (
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
            <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">Admin Account</p>
            <p className="font-bold text-sm">Coach Richards</p>
            <button 
              onClick={() => { localStorage.removeItem('auth'); window.location.reload(); }}
              className="mt-3 w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-sky-100 text-sky-400 hover:border-primary hover:text-primary transition-all group"
          >
            <UserCog size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-wider">Admin Login</span>
          </NavLink>
        )}
      </div>
    </aside>
  );
}
