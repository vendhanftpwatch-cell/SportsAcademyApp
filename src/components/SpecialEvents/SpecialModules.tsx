import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, Calendar, MapPin, Zap, UserCheck, Star, Clock, Trophy, Bell, Trash2, Plus, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function SummerCamp() {
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 5, mins: 42, secs: 10 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => ({
        ...prev,
        secs: prev.secs > 0 ? prev.secs - 1 : 59,
        mins: prev.secs === 0 ? (prev.mins > 0 ? prev.mins - 1 : 59) : prev.mins
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 md:space-y-8 pb-4 md:pb-12">
      {/* Hero Banner */}
      <div className="sporty-gradient rounded-[1.75rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 text-white relative overflow-hidden shadow-2xl min-h-[280px] sm:min-h-[320px] md:min-h-[400px] flex flex-col justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none"></div>
        <Sun className="absolute top-[-20px] sm:top-[-30px] right-[-20px] sm:right-[-30px] w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 text-white/10" />
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-1.5 md:gap-2 bg-white/20 backdrop-blur-md px-3 md:px-4 py-1 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-white/20 mb-4 md:mb-6"
          >
            <Star size={12} className="md:w-3.5 md:h-3.5 text-yellow-300 fill-yellow-300" /> Biggest Event of 2024
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight mb-4 md:mb-6">Unleash Your Inner Pro This Summer!</h1>
          <p className="text-base md:text-lg lg:text-xl text-white/90 font-medium mb-6 md:mb-10 leading-relaxed">Join 500+ athletes for intensive training, professional coaching, and unforgettable memories. Registration is now open!</p>

          <div className="flex flex-wrap gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-10">
            {Object.entries(timeLeft).map(([label, value]) => (
              <div key={label} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold bg-white/15 backdrop-blur-sm w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/20 mb-1 md:mb-2">
                  {value.toString().padStart(2, '0')}
                </div>
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-70">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col xs:flex-row gap-3 md:gap-4">
            <button className="bg-white text-primary px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-base shadow-xl hover:scale-105 transition-transform active:scale-95 min-h-[44px]">REGISTER NOW</button>
            <button className="bg-transparent border-2 border-white/30 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base hover:bg-white/10 transition-colors min-h-[44px]">CAMP GUIDE</button>
          </div>
        </div>
      </div>

      {/* Camp Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-card-border">
          <h3 className="text-2xl font-display font-bold text-slate-800 mb-8 flex items-center gap-3">
            <Calendar className="text-primary" /> Camp Schedule
          </h3>
          <div className="space-y-4 md:space-y-5">
            {[
              { week: 'Week 1', focus: 'Fundamental Skills &amp; Drills', date: 'July 1st - 7th', color: 'bg-violet-50 text-violet-700 border border-violet-100' },
              { week: 'Week 2', focus: 'Advanced Tactical Training', date: 'July 8th - 14th', color: 'bg-orange-50 text-electric border border-orange-100' },
              { week: 'Week 3', focus: 'Internal Academy League', date: 'July 15th - 21st', color: 'bg-sky-50 text-accent border border-sky-100' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 md:gap-6 p-4 rounded-2xl hover:bg-violet-50/50 transition-colors group border border-transparent hover:border-violet-100">
                <div className={cn("w-16 h-20 md:w-20 md:h-24 rounded-2xl flex flex-col items-center justify-center font-semibold shadow-sm", item.color)}>
                  <span className="text-xs uppercase opacity-70">Week</span>
                  <span className="text-2xl font-display">{i + 1}</span>
                </div>
                <div className="flex-1 py-2">
                  <h4 className="text-lg font-bold text-slate-700 mb-1 group-hover:text-primary transition-colors">{item.focus}</h4>
                  <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {item.date}</span>
                    <span className="flex items-center gap-1"><UserCheck size={14} /> {item.week}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 border border-card-border">
          <h3 className="text-2xl font-display font-bold text-slate-800 mb-8 flex items-center gap-3">
            <Zap className="text-warning" /> Featured Coaches
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-card-border shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-100 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=coach${i}`} alt="coach" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-700">Coach Elite {i}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Pro Specialist</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 md:mt-8 p-5 md:p-6 bg-slate-50 rounded-2xl border border-card-border">
             <h4 className="font-semibold text-slate-700 mb-2 md:mb-3">Age Categories</h4>
             <div className="flex flex-wrap gap-2">
               {['Under-10', 'Under-13', 'Under-16', 'Pro-College'].map(cat => (
                 <span key={cat} className="px-3 py-1 bg-white text-slate-600 text-xs font-semibold rounded-lg border border-card-border">{cat}</span>
               ))}
             </div>
             <p className="mt-3 md:mt-4 text-sm text-slate-500 font-medium">Limited spots available for each category. Early registration ensures participation in exclusive workshops.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UpcomingEvents({ isAdmin = false }: { isAdmin?: boolean }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    teamA: '',
    teamB: '',
    date: 'May 25, 2024',
    time: '04:00 PM',
    venue: 'Central Stadium',
    color: 'from-primary to-accent'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowAddModal(false);
        setFormData({ title: '', teamA: '', teamB: '', date: 'May 25, 2024', time: '04:00 PM', venue: 'Central Stadium', color: 'from-primary to-accent' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-800 tracking-tight">Tournament Central</h2>
          <p className="text-slate-500 font-medium text-sm md:text-base">Match schedules, championships, and events</p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2 md:gap-4">
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="sporty-gradient text-white px-5 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold flex items-center gap-2 min-h-[40px] md:min-h-[44px] shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <Plus size={18} className="md:w-5 md:h-5" /> Add Event
            </button>
          )}
          <button className="bg-white px-4 md:px-6 py-2 md:py-3 flex items-center gap-2 text-primary font-bold min-h-[40px] md:min-h-[44px] shadow-sm border border-card-border rounded-xl md:rounded-2xl hover:shadow-md hover:bg-violet-50 transition-all">
             <Bell size={18} className="md:w-5 md:h-5 text-primary" /> Notify Me
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <h3 className="text-lg md:text-xl font-display font-black text-slate-800 tracking-tight">Featured Matches</h3>
{loading ? (
             <div className="h-40 bg-slate-50 animate-pulse rounded-2xl" />
           ) : events.length === 0 ? (
             <div className="p-8 md:p-12 text-center bg-white rounded-[1.75rem] md:rounded-[2.5rem] border-2 border-dashed border-card-border shadow-sm">
               <p className="text-slate-400 font-medium text-sm md:text-base">No matches scheduled currently.</p>
             </div>
           ) : (
             events.map((event, i) => (
               <motion.div
                 key={event._id}
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.1 }}
                 className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row bento-card-hover border border-card-border relative group"
               >
                 {isAdmin && (
                   <button
                     onClick={() => deleteEvent(event._id)}
                     className="absolute top-3 md:top-4 right-3 md:right-4 p-1.5 md:p-2 text-slate-400 hover:text-danger transition-opacity z-20 group-hover:opacity-100 opacity-0 bg-white/80 rounded-xl shadow-sm"
                   >
                     <Trash2 size={14} className="md:w-4 md:h-4" />
                   </button>
                 )}
                 <div className={cn("w-full md:w-1.5", `bg-gradient-to-b ${event.color || 'from-primary to-accent'}`)}></div>
                 <div className="flex-1 p-4 md:p-8">
                   <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 md:mb-6 gap-2 md:gap-0">
                      <span className="px-3 py-1 bg-violet-50 text-primary text-[10px] font-bold rounded-lg uppercase tracking-widest border border-violet-100 self-start">{event.title}</span>
                      <div className="flex items-center gap-1.5 md:gap-2 text-slate-400 font-semibold text-[10px] md:text-[11px] uppercase"><Clock size={12} className="md:w-3.5 md:h-3.5 text-slate-300" /> {event.time}</div>
                   </div>

                   <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-4 md:gap-6 lg:gap-8 py-2 md:py-4 px-1 md:px-2">
                     <div className="text-center flex-1 mb-3 sm:mb-0">
                       <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-50 rounded-full mx-auto mb-2 md:mb-3 flex items-center justify-center text-xl md:text-2xl shadow-inner border border-card-border">🐯</div>
                       <h4 className="font-display font-bold text-slate-800 tracking-tight text-sm md:text-base">{event.teamA}</h4>
                     </div>
                     <div className="text-center font-display font-black text-2xl md:text-3xl lg:text-4xl text-slate-200 mb-3 sm:mb-0">VS</div>
                     <div className="text-center flex-1">
                       <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-50 rounded-full mx-auto mb-2 md:mb-3 flex items-center justify-center text-xl md:text-2xl shadow-inner border border-card-border">🦅</div>
                       <h4 className="font-display font-bold text-slate-800 tracking-tight text-sm md:text-base">{event.teamB}</h4>
                     </div>
                   </div>

                   <div className="mt-4 md:mt-8 pt-4 md:pt-6 border-t border-card-border flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
                     <div className="flex flex-col xs:flex-row xs:flex-wrap gap-2 md:gap-6 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                       <span className="flex items-center gap-1"><MapPin size={12} className="md:w-3.5 md:h-3.5 text-slate-300" /> {event.venue}</span>
                       <span className="flex items-center gap-1"><Calendar size={12} className="md:w-3.5 md:h-3.5 text-slate-300" /> {event.date}</span>
                     </div>
                     <button className="text-primary font-bold text-[10px] md:text-[11px] uppercase tracking-widest hover:underline self-start md:self-auto">Details →</button>
                   </div>
                 </div>
               </motion.div>
             ))
           )}
        </div>

        <div className="space-y-6">
           <h3 className="text-xl font-display font-bold text-slate-800">Academy News</h3>
           <div className="bg-white rounded-2xl p-5 md:p-6 space-y-3 shadow-sm border border-card-border">
              {[
                { title: 'Training Camp Postponed', date: '2 hours ago', icon: Bell, color: 'text-warning' },
                { title: 'New Pool Opening Ceremony', date: 'Yesterday', icon: Trophy, color: 'text-primary' },
                { title: 'U-12 Victory in State League', date: '2 days ago', icon: Star, color: 'text-success' },
              ].map((news, i) => (
                <div key={i} className="flex gap-3 md:gap-4 p-3.5 md:p-4 rounded-2xl hover:bg-violet-50/50 transition-colors cursor-pointer group border border-transparent hover:border-violet-100">
                  <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white shadow-sm border border-card-border flex items-center justify-center", news.color)}>
                    <news.icon size={18} className="md:w-5 md:h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors leading-tight">{news.title}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">{news.date}</span>
                  </div>
                </div>
              ))}
           </div>

           <div className="sporty-gradient rounded-2xl p-6 md:p-8 text-white shadow-lg">
            <Trophy size={28} className="mb-3 md:mb-4 opacity-70" />
            <h4 className="text-lg md:text-xl font-display font-bold mb-2">Join Member League</h4>
            <p className="text-white/90 text-sm mb-5 md:mb-6 leading-relaxed">Exclusive for internal students. Weekly matches, ranking systems, and monthly prizes.</p>
            <button className="w-full bg-white text-primary font-bold py-2.5 md:py-3 rounded-xl text-sm hover:opacity-90 transition-opacity">LEARN MORE</button>
           </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" style={{ background: 'rgba(124, 58, 237, 0.08)' }} onClick={() => setShowAddModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl p-8 md:p-10">
            <div className="flex justify-between mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-black text-slate-800">Add New Event</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"><X /></button>
            </div>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Event Title</label>
                <input type="text" placeholder="e.g. Inter-Academy Cup" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-bold outline-none focus:ring-2 focus:ring-primary/20 text-slate-800" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Team A / Athlete 1</label>
                  <input type="text" placeholder="Team A" value={formData.teamA} onChange={e => setFormData({...formData, teamA: e.target.value})} className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-bold outline-none focus:ring-2 focus:ring-primary/20 text-slate-800" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Team B / Athlete 2</label>
                  <input type="text" placeholder="Team B" value={formData.teamB} onChange={e => setFormData({...formData, teamB: e.target.value})} className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-bold outline-none focus:ring-2 focus:ring-primary/20 text-slate-800" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Date</label>
                  <input type="text" placeholder="May 25, 2024" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-bold outline-none focus:ring-2 focus:ring-primary/20 text-slate-800" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Time</label>
                  <input type="text" placeholder="04:00 PM" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-bold outline-none focus:ring-2 focus:ring-primary/20 text-slate-800" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Venue</label>
                <input type="text" placeholder="Central Stadium" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-bold outline-none focus:ring-2 focus:ring-primary/20 text-slate-800" />
              </div>
              <button type="submit" className="w-full h-16 sporty-gradient text-white rounded-2xl font-black uppercase tracking-widest mt-4 shadow-lg shadow-violet-400/20 active:scale-[0.98] transition-all">Save Event</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
