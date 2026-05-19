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
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="vibrant-orange rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl shadow-orange-100 min-h-[400px] flex flex-col justify-center">
        <Sun className="absolute top-[-40px] right-[-40px] w-80 h-80 text-white/10" />
        <div className="relative z-10 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20 mb-6"
          >
            <Star size={14} className="text-yellow-300 fill-yellow-300" /> Biggest Event of 2024
          </motion.div>
          <h1 className="text-6xl font-display font-black leading-tight mb-6">Unleash Your Inner Pro This Summer!</h1>
          <p className="text-xl text-white/90 font-medium mb-10 leading-relaxed">Join 500+ athletes for intensive training, professional coaching, and unforgettable memories. Registration is now open!</p>
          
          <div className="flex flex-wrap gap-8 mb-10">
            {Object.entries(timeLeft).map(([label, value]) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-display font-bold bg-white/10 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center border border-white/20 mb-2">
                  {value.toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button className="bg-white text-secondary px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform">REGISTER NOW</button>
            <button className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors">CAMP GUIDE</button>
          </div>
        </div>
      </div>

      {/* Camp Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h3 className="text-2xl font-display font-bold text-slate-800 mb-8 flex items-center gap-3">
            <Calendar className="text-primary" /> Camp Schedule
          </h3>
          <div className="space-y-6">
            {[
              { week: 'Week 1', focus: 'Fundamental Skills & Drills', date: 'July 1st - 7th', color: 'bg-blue-50 text-primary' },
              { week: 'Week 2', focus: 'Advanced Tactical Training', date: 'July 8th - 14th', color: 'bg-orange-50 text-secondary' },
              { week: 'Week 3', focus: 'Internal Academy League', date: 'July 15th - 21th', color: 'bg-purple-50 text-accent' },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 p-4 rounded-3xl hover:bg-slate-50 transition-colors group">
                <div className={cn("w-20 h-24 rounded-2xl flex flex-col items-center justify-center font-bold shadow-sm", item.color)}>
                  <span className="text-xs uppercase opacity-70">Week</span>
                  <span className="text-2xl font-display">{i+1}</span>
                </div>
                <div className="flex-1 py-2">
                  <h4 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-primary transition-colors">{item.focus}</h4>
                  <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {item.date}</span>
                    <span className="flex items-center gap-1"><UserCheck size={14} /> {item.week}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 bg-blue-50/30 border-blue-100">
          <h3 className="text-2xl font-display font-bold text-slate-800 mb-8 flex items-center gap-3">
            <Zap className="text-yellow-500" /> Featured Coaches
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-blue-50 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=coach${i}`} alt="coach" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-700">Coach Elite {i}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Pro Specialist</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-white rounded-3xl shadow-sm border border-blue-50">
             <h4 className="font-bold text-slate-800 mb-2">Age Categories</h4>
             <div className="flex flex-wrap gap-2">
               {['Under-10', 'Under-13', 'Under-16', 'Pro-College'].map(cat => (
                 <span key={cat} className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-bold rounded-lg border border-slate-100">{cat}</span>
               ))}
             </div>
             <p className="mt-4 text-sm text-slate-500 font-medium">Limited spots available for each category. Early registration ensures participation in exclusive workshops.</p>
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
    color: 'from-blue-500 to-blue-600'
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
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
        setFormData({ title: '', teamA: '', teamB: '', date: 'May 25, 2024', time: '04:00 PM', venue: 'Central Stadium', color: 'from-blue-500 to-blue-600' });
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-800">Tournament Central</h2>
          <p className="text-slate-500 font-medium">Match schedules, championships, and events</p>
        </div>
        <div className="flex gap-4">
          {isAdmin && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
            >
              <Plus size={20} /> Add Event
            </button>
          )}
          <button className="glass-card px-6 py-3 flex items-center gap-2 text-slate-600 font-bold">
             <Bell size={20} className="text-primary" /> Notify Me
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-display font-black text-slate-800">Featured Matches</h3>
          {loading ? (
            <div className="h-40 bg-slate-50 animate-pulse rounded-3xl" />
          ) : events.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">No matches scheduled currently.</p>
            </div>
          ) : (
            events.map((event, i) => (
              <motion.div 
                key={event._id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bento-card overflow-hidden shadow-lg border border-sky-100 flex bento-card-hover relative group"
              >
                {isAdmin && (
                  <button 
                    onClick={() => deleteEvent(event._id)}
                    className="absolute top-4 right-4 p-2 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <div className={cn("w-3 text-transparent", `bg-gradient-to-b ${event.color || 'from-blue-500 to-blue-600'}`)}>|</div>
                <div className="flex-1 p-8">
                  <div className="flex justify-between items-start mb-6">
                     <span className="px-3 py-1 bg-sky-50 text-primary text-[10px] font-black rounded-lg uppercase tracking-widest border border-sky-100">{event.title}</span>
                     <div className="flex items-center gap-2 text-slate-300 font-bold text-[11px] uppercase"><Clock size={12} /> {event.time}</div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-8 py-4 px-2">
                    <div className="text-center flex-1">
                      <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl shadow-inner border border-slate-100">🐯</div>
                      <h4 className="font-display font-black text-slate-800 tracking-tight">{event.teamA}</h4>
                    </div>
                    <div className="text-center font-display font-black text-4xl text-slate-100">VS</div>
                    <div className="text-center flex-1">
                      <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl shadow-inner border border-slate-100">🦅</div>
                      <h4 className="font-display font-black text-slate-800 tracking-tight">{event.teamB}</h4>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
                      <span className="flex items-center gap-1.5"><MapPin size={14} className="text-sky-300" /> {event.venue}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-sky-300" /> {event.date}</span>
                    </div>
                    <button className="text-primary font-black text-[11px] uppercase tracking-widest hover:underline">Details →</button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="space-y-6">
           <h3 className="text-xl font-display font-black text-slate-800">Academy News</h3>
           <div className="bento-card p-6 space-y-4">
              {[
                { title: 'Training Camp Postponed', date: '2 hours ago', icon: Bell, color: 'text-warning' },
                { title: 'New Pool Opening Ceremony', date: 'Yesterday', icon: Trophy, color: 'text-primary' },
                { title: 'U-12 Victory in State League', date: '2 days ago', icon: Star, color: 'text-success' },
              ].map((news, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-3xl hover:bg-sky-50 transition-colors cursor-pointer group border border-transparent hover:border-sky-100">
                  <div className={cn("w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center", news.color)}>
                    <news.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-700 group-hover:text-primary transition-colors leading-tight">{news.title}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">{news.date}</span>
                  </div>
                </div>
              ))}
           </div>
           
            <div className="sporty-gradient rounded-3xl p-8 text-white shadow-xl shadow-blue-100">
             <Trophy size={32} className="mb-4 opacity-70" />
             <h4 className="text-xl font-display font-bold mb-2">Join Member League</h4>
             <p className="text-white/80 text-sm mb-6 leading-relaxed">Exclusive for internal students. Weekly matches, ranking systems, and monthly prizes.</p>
             <button className="w-full bg-white text-primary font-bold py-3 rounded-xl text-sm">LEARN MORE</button>
           </div>
        </div>
      </div>
      
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-10">
            <div className="flex justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900">Add New Event</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Event Title</label>
                <input type="text" placeholder="e.g. Inter-Academy Cup" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 font-bold outline-none ring-primary/20 focus:ring-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Team A / Athlete 1</label>
                  <input type="text" placeholder="Team A" value={formData.teamA} onChange={e => setFormData({...formData, teamA: e.target.value})} className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 font-bold outline-none ring-primary/20 focus:ring-2" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Team B / Athlete 2</label>
                  <input type="text" placeholder="Team B" value={formData.teamB} onChange={e => setFormData({...formData, teamB: e.target.value})} className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 font-bold outline-none ring-primary/20 focus:ring-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Date</label>
                  <input type="text" placeholder="May 25, 2024" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 font-bold outline-none ring-primary/20 focus:ring-2" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Time</label>
                  <input type="text" placeholder="04:00 PM" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 font-bold outline-none ring-primary/20 focus:ring-2" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Venue</label>
                <input type="text" placeholder="Central Stadium" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 font-bold outline-none ring-primary/20 focus:ring-2" />
              </div>
              <button type="submit" className="w-full h-16 sporty-gradient text-white rounded-2xl font-black uppercase tracking-widest mt-4 shadow-xl shadow-blue-100">Save Event</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
