import React from 'react';
import { motion } from 'motion/react';
import { 
  History, 
  CreditCard, 
  Clock, 
  Wallet, 
  ArrowRight,
  ShieldAlert,
  UserCheck,
  BadgeDollarSign,
  Settings
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const adminModules = [
  {
    title: 'Student Archive',
    description: 'Manage historical student records and enrollment data.',
    icon: History,
    path: '/students/archive',
    color: 'bg-blue-500',
    stats: '1,248 Records'
  },
  {
    title: 'Student Fees',
    description: 'Track student payment status and fee collection.',
    icon: CreditCard,
    path: '/fees',
    color: 'bg-indigo-500',
    stats: '$12.4k Collected'
  },
  {
    title: 'Coach Attendance',
    description: 'Monitor daily coach check-ins and session hours.',
    icon: Clock,
    path: '/attendance/coaches',
    color: 'bg-emerald-500',
    stats: '98% On-time'
  },
  {
    title: 'Pay Details',
    description: 'Process payroll and view coach salary structures.',
    icon: Wallet,
    path: '/coaches/pay',
    color: 'bg-orange-500',
    stats: 'Next: June 1st'
  },
  {
    title: 'System Settings',
    description: 'Configure academy profiles, notifications, and security.',
    icon: Settings,
    path: '/settings',
    color: 'bg-slate-700',
    stats: 'All Systems Go'
  }
];

export function AdminPanel() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <ShieldAlert size={20} />
            </div>
            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Administrative Console</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Management</h1>
          <p className="text-slate-500 font-medium mt-1">Secure access to academy financial and internal operations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {adminModules.map((module, i) => (
          <motion.div
            key={module.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <NavLink 
              to={module.path}
              className="group block bento-card p-8 bento-card-hover relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${module.color} opacity-[0.03] rounded-bl-full group-hover:scale-150 transition-transform duration-700`} />
              
              <div className="flex items-start justify-between relative z-10">
                <div className={`w-16 h-16 ${module.color} rounded-3xl flex items-center justify-center text-white shadow-xl shadow-${module.color.split('-')[1]}-100 mb-6 group-hover:scale-110 transition-transform`}>
                  <module.icon size={32} />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none block mb-1">Status</span>
                  <span className="text-sm font-black text-slate-800">{module.stats}</span>
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-primary transition-colors">{module.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{module.description}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Enter Module</span>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowRight size={18} />
                </div>
              </div>
            </NavLink>
          </motion.div>
        ))}
      </div>

      <div className="bento-card p-10 bg-slate-900 text-white overflow-hidden relative border-none">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10">
          <BadgeDollarSign size={240} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-black tracking-tight">Financial Health Sync</h2>
            <p className="text-slate-400 max-w-md leading-relaxed font-medium">All financial reports are automatically synchronized with the academy bank account every 24 hours.</p>
          </div>
          <button className="px-10 py-5 bg-white text-slate-900 font-black rounded-3xl text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-2xl">
            Audit Ledger Now
          </button>
        </div>
      </div>
    </div>
  );
}
