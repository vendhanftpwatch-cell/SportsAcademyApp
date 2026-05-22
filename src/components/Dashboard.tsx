import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  UserCog,
  TrendingUp,
  Bell,
  Calendar,
  Trophy,
  ArrowUpRight,
  ClipboardCheck,
  CreditCard,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const incomeData = [
  { name: 'Jan', income: 4000 },
  { name: 'Feb', income: 5200 },
  { name: 'Mar', income: 4800 },
  { name: 'Apr', income: 6100 },
  { name: 'May', income: 5900 },
  { name: 'Jun', income: 7200 },
];

const StatCard = ({ title, value, icon: Icon, colorClass, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6 flex items-center justify-between"
  >
    <div>
      <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-3xl font-display font-bold text-slate-800">{value}</h3>
      <div className="flex items-center gap-1 mt-2 text-success text-xs font-semibold">
        <ArrowUpRight size={14} />
        <span>12% Increase</span>
      </div>
    </div>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${colorClass} shadow-md`}>
      <Icon size={28} />
    </div>
  </motion.div>
);

interface DashboardProps {
  isAdmin?: boolean;
}

export function Dashboard({ isAdmin = false }: DashboardProps) {
  const navigate = useNavigate();
  const [todaySchedule, setTodaySchedule] = React.useState<any[]>([]);
  const [loadingSchedule, setLoadingSchedule] = React.useState(true);

  React.useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = days[new Date().getDay()];
        const res = await fetch('/api/schedules');
        const data = await res.json();
        const schedules = Array.isArray(data) ? data : [];
        const filtered = schedules.filter((item: any) => item.day === todayName);
        setTodaySchedule(filtered);
      } catch (err) {
        console.error('Failed to load today schedule:', err);
        setTodaySchedule([]);
      } finally {
        setLoadingSchedule(false);
      }
    };
    fetchSchedule();
  }, []);

  return (
    <div className="flex flex-col gap-4 md:gap-6 h-full font-sans pb-4 md:pb-6 lg:pb-10">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-violet-900 tracking-tight">Welcome to <span className="sporty-gradient bg-clip-text text-transparent">Vendhan Academy!</span></h1>
          <p className="text-slate-500 font-medium text-sm md:text-base">{isAdmin ? "Managing champion athletes and schedules today." : "Train like a pro with our elite sports programs."}</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative p-2 md:p-3 bg-white rounded-full shadow-sm border border-card-border hover:scale-110 transition-transform cursor-pointer touch-target">
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-electric border-2 border-white rounded-full"></span>
            <Bell size={18} className="md:w-5 md:h-5 text-primary" />
          </div>
          <div className="flex items-center gap-2 bg-white p-1.5 pr-3 md:pr-4 rounded-full border border-card-border shadow-sm">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full overflow-hidden shadow-sm">
              <div className="w-full h-full sporty-gradient"></div>
            </div>
            <span className="font-semibold text-xs md:text-sm text-slate-700">{isAdmin ? 'Admin Portal' : 'Public Access'}</span>
          </div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 md:gap-6 mobile-grid-single">
        {/* Summer Camp Banner */}
        <div className="md:col-span-12 rounded-[1.75rem] sm:rounded-[2rem] md:rounded-[2rem] p-4 md:p-6 lg:p-8 shadow-lg relative overflow-hidden text-white vibrant-indigo bento-card-hover border-none min-h-[150px] md:min-h-[180px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(236,72,153,0.3),transparent_60%)] pointer-events-none"></div>
          <div className="relative z-10">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-1 md:mb-2">Summer Camp 2024!</h2>
              <p className="text-white/90 text-xs md:text-sm max-w-[220px] md:max-w-[260px] leading-relaxed">Limited slots remaining for Football and Swimming. Register today!</p>
              <button
                onClick={() => navigate('/summer-camp')}
                className="mt-3 md:mt-4 px-4 md:px-6 lg:px-8 py-1.5 md:py-2 lg:py-3 bg-white text-primary font-black rounded-full shadow-md text-xs md:text-sm hover:scale-105 transition-transform active:scale-95 touch-target"
              >
                JOIN NOW
              </button>
            </motion.div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="md:col-span-7 bento-card p-4 md:p-6 lg:p-8 bento-card-hover">
          <div className="flex justify-between items-center mb-3 md:mb-4 lg:mb-6">
            <h3 className="font-black text-violet-900 text-base md:text-lg flex items-center gap-2">
              <Calendar className="text-primary w-4 h-4 md:w-5 md:h-5" /> Today's Schedule
            </h3>
            <Link to="/schedule" className="text-primary font-bold text-[9px] md:text-xs hover:underline">Full Weekly Plan</Link>
          </div>
          <div className="space-y-3 md:space-y-4">
            {loadingSchedule ? (
              <div className="space-y-3 md:space-y-4">
                {[1, 2].map(i => <div key={i} className="h-14 md:h-20 bg-slate-50 animate-pulse rounded-2xl md:rounded-2xl" />)}
              </div>
            ) : todaySchedule.length === 0 ? (
              <div className="p-4 md:p-6 lg:p-8 text-center bg-slate-50/80 rounded-2xl border border-dashed border-card-border">
                <p className="text-slate-400 font-medium text-sm md:text-base">No sessions scheduled for today.</p>
                {isAdmin && (
                  <button onClick={() => navigate('/schedule')} className="mt-3 md:mt-4 text-[9px] md:text-xs font-black text-primary uppercase tracking-widest hover:underline">Add Session +</button>
                )}
              </div>
            ) : (
              todaySchedule.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="p-3 md:p-4 bg-violet-50/70 rounded-2xl flex items-center justify-between border border-violet-100/60 hover:bg-violet-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 md:gap-5">
                    <div className="text-[9px] md:text-xs font-bold text-primary bg-white px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-violet-100 shadow-sm">{item.time}</div>
                    <div>
                      <p className="font-semibold text-slate-800 group-hover:text-primary transition-colors text-xs md:text-base">{item.activity}</p>
                      <p className="text-[10px] md:text-[11px] text-slate-400 font-medium">{item.coach} · {item.location}</p>
                    </div>
                  </div>
                  <span className={cn("px-2 md:px-3 py-0.5 md:py-1 text-white text-[8px] md:text-[9px] font-bold rounded-full bg-emerald-500 neon-primary")}>
                    ACTIVE
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="md:col-span-5 bento-card p-0 overflow-hidden bento-card-hover border-none shadow-md min-h-[150px] md:min-h-[200px]">
          <img
            src="/dashboard-image.png"
            alt="Academy Schedule"
            className="w-full h-full object-contain bg-slate-50"
          />
        </div>

        {/* Categories Section */}
        <div className="md:col-span-4 bento-card p-4 md:p-6 bento-card-hover flex flex-col justify-between" onClick={() => navigate('/sports')}>
          <div>
            <h3 className="font-black text-violet-900 text-base md:text-lg mb-3 md:mb-4 lg:mb-6 flex items-center gap-2">
              <Trophy size={16} className="md:w-5 md:h-5 text-warning" /> Categories
            </h3>
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              {[
                { icon: '⚽', label: 'Football', color: 'bg-cyan-50 text-cyan-700 border border-cyan-100' },
                { icon: '🏏', label: 'Cricket', color: 'bg-orange-50 text-orange-700 border border-orange-100' },
                { icon: '🎾', label: 'Tennis', color: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
                { icon: '🏊', label: 'Swimming', color: 'bg-violet-50 text-violet-600 border border-violet-100' },
              ].map(sport => (
                <div key={sport.label} className={cn("aspect-square rounded-2xl flex flex-col items-center justify-center p-1 md:p-2 text-center transition-transform hover:scale-105 cursor-pointer", sport.color)}>
                  <div className="text-xl md:text-2xl mb-1">{sport.icon}</div>
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-tight">{sport.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 md:mt-6 lg:mt-8 p-3 md:p-5 bg-slate-50/80 rounded-2xl border border-card-border">
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mb-1 md:mb-2 uppercase tracking-widest">Performance</p>
            <div className="flex items-end gap-1 md:gap-2">
              <span className="text-2xl md:text-3xl font-black text-primary leading-none">92%</span>
              <span className="text-[9px] md:text-[10px] text-success font-bold mb-1 flex items-center tracking-tight"><ArrowUpRight size={10} className="md:w-3 md:h-3" /> 4%</span>
            </div>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-medium mt-1">vs Average last week</p>
          </div>
        </div>

        {/* Finance Section or News Section */}
        {isAdmin ? (
          <div className="md:col-span-4 bg-violet-50/60 border border-violet-100 rounded-2xl p-4 md:p-6 lg:p-8 flex flex-col bento-card-hover">
            <h3 className="font-black text-violet-700 text-base md:text-lg mb-3 md:mb-4 lg:mb-6 flex items-center gap-2">
              <CreditCard size={16} className="md:w-5 md:h-5 text-primary" /> Finance
            </h3>
            <div className="flex-1 flex flex-col justify-center space-y-3 md:space-y-4 lg:space-y-6">
              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between items-end">
                  <p className="text-[9px] md:text-[10px] text-violet-600 font-bold uppercase tracking-widest">FEES PAID</p>
                  <p className="text-xl md:text-2xl font-bold text-slate-800">₹12,450</p>
                </div>
                <div className="w-full h-2 md:h-3 bg-violet-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    className="h-full vibrant-indigo"
                  />
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between items-end">
                  <p className="text-[9px] md:text-[10px] text-orange-500 font-bold uppercase tracking-widest">PENDING</p>
                  <p className="text-xl md:text-2xl font-bold text-electric">₹2,100</p>
                </div>
                <div className="w-full h-2 md:h-3 bg-violet-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '25%' }}
                    className="h-full vibrant-pink"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/fees')}
              className="mt-4 md:mt-6 lg:mt-8 w-full py-2.5 md:py-3 lg:py-4 sporty-gradient text-white rounded-xl md:rounded-2xl font-bold text-[9px] md:text-xs uppercase tracking-widest shadow-md hover:opacity-90 transition-all touch-target active:scale-[0.98]"
            >
              Manage Fees
            </button>
          </div>
        ) : (
          <div className="md:col-span-4 bg-white border border-card-border rounded-2xl p-4 md:p-6 lg:p-8 flex flex-col bento-card-hover">
            <h3 className="font-black text-violet-900 text-base md:text-lg mb-3 md:mb-4 lg:mb-6 flex items-center gap-2">
              <TrendingUp size={16} className="md:w-5 md:h-5 text-primary" /> Growth
            </h3>
            <div className="flex-1 space-y-3 md:space-y-4 lg:space-y-6">
              <div className="p-3 md:p-4 bg-violet-50/60 rounded-xl border border-violet-100 cursor-pointer" onClick={() => navigate('/students/archive')}>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1 md:mb-2">New Enrollments</p>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="text-xl md:text-2xl font-black text-primary">+128</div>
                  <div className="text-[9px] md:text-[10px] bg-emerald-50 text-success px-1.5 md:px-2 py-0.5 rounded-md font-semibold border border-emerald-100">THIS MONTH</div>
                </div>
              </div>
              <div className="p-3 md:p-4 bg-rose-50/60 rounded-xl border border-rose-100 cursor-pointer" onClick={() => navigate('/sports')}>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1 md:mb-2">Sports Offered</p>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="text-xl md:text-2xl font-black text-electric">12+</div>
                  <div className="text-[9px] md:text-[10px] bg-slate-50 text-slate-500 px-1.5 md:px-2 py-0.5 rounded-md font-semibold border border-card-border">ACTIVE</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/gallery')}
              className="mt-4 md:mt-6 lg:mt-8 w-full py-2.5 md:py-3 lg:py-4 bg-slate-50 text-slate-600 rounded-xl md:rounded-2xl font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] border border-card-border hover:bg-slate-100 transition-colors touch-target"
            >
              Academy Gallery
            </button>
          </div>
        )}

        {/* Quick Actions / Enrollment Section */}
        <div className="md:col-span-4 flex flex-col gap-3 md:gap-4 lg:gap-6">
          <div className="flex gap-2 md:gap-4 lg:gap-6 items-center px-0 md:px-2 mb-1 md:mb-2">
            <div className="flex -space-x-1.5 md:-space-x-2 lg:-space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-7 h-7 md:w-8 md:h-8 lg:w-12 lg:h-12 rounded-full border-[1.5px] md:border-2 lg:border-4 border-white overflow-hidden shadow-sm">
                  <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=user${i}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-6 h-6 md:w-7 md:h-7 lg:w-12 lg:h-12 rounded-full bg-primary flex items-center justify-center text-white text-[7px] md:text-[9px] lg:text-xs font-bold shadow-md neon-primary">+38</div>
            </div>
            <div>
              <p className="text-xs md:text-sm text-slate-600 font-medium leading-tight">
                <span className="text-violet-900 font-bold">38 new enrollments</span> this week!
              </p>
              <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase mt-0.5 md:mt-1 tracking-widest">Rapid Growth</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/events')}
            className="w-full h-10 md:h-12 lg:h-16 bg-slate-50 border border-card-border rounded-xl md:rounded-2xl lg:rounded-2xl flex items-center justify-between px-3 md:px-4 lg:px-8 group hover:bg-violet-50 hover:border-violet-200 transition-all shadow-sm hover:shadow-md touch-target active:scale-[0.98]"
          >
            <span className="text-[9px] md:text-[10px] font-bold text-slate-600 uppercase tracking-widest group-hover:text-primary transition-colors">Upcoming Events</span>
            <ArrowUpRight size={16} className="md:w-5 md:h-5 text-slate-400 group-hover:text-primary transition-colors group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>

          <button
            onClick={() => navigate('/attendance/students')}
            className="w-full h-10 md:h-12 lg:h-16 sporty-gradient rounded-xl md:rounded-2xl lg:rounded-2xl flex items-center justify-between px-3 md:px-4 lg:px-8 group transition-all shadow-md neon-primary touch-target active:scale-[0.98]"
          >
            <span className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-[0.2em]">Check Attendance</span>
            <ClipboardCheck size={16} className="md:w-5 md:h-5 text-emerald-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
