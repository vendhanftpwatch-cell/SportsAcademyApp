import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Users, Clock, MapPin, Package, UserCheck, ChevronRight, Plus, X, Trash2, Edit2, Save } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Sport {
  _id: string;
  name: string;
  coach: string;
  timing: string;
  location: string;
  maxStudents: number;
  currentStudents: number;
  fees: number;
  image?: string;
}

interface SportsListProps {
  isAdmin?: boolean;
}

export function SportsList({ isAdmin = false }: SportsListProps) {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    coach: '',
    timing: '06:00 AM - 08:00 AM',
    location: 'Main Ground',
    maxStudents: 30,
    fees: 1500
  });

  const fetchData = () => {
    setLoading(true);
    fetch('/api/sports')
      .then(res => res.json())
      .then(data => {
        setSports(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Failed to fetch sports:', error);
        setSports([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/sports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowAddModal(false);
        setFormData({
          name: '',
          coach: '',
          timing: '06:00 AM - 08:00 AM',
          location: 'Main Ground',
          maxStudents: 30,
          fees: 1500
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSport = async (id: string) => {
    if (!confirm("Remove this sport from the academy?")) return;
    try {
      await fetch(`/api/sports/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-800 tracking-tight">Sports Categories</h2>
          <p className="text-slate-500 font-medium text-sm md:text-base">Explore all training disciplines at our academy</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="sporty-gradient text-white px-5 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-3xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:scale-105 transition-transform active:scale-95 flex items-center gap-2 min-h-[40px] md:min-h-[44px]"
          >
            <Plus size={16} className="md:w-5 md:h-5" /> New Discipline
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 md:h-80 bento-card animate-pulse shadow-sm" />)
        ) : sports.map((sport, i) => (
          <motion.div 
            key={sport._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bento-card p-0 overflow-hidden group bento-card-hover relative"
          >
            {isAdmin && (
              <button 
                onClick={() => deleteSport(sport._id)}
                className="absolute top-4 right-4 z-20 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <Trash2 size={16} />
              </button>
            )}
<div className="h-40 sm:h-44 relative overflow-hidden">
               <img 
                 src={sport.image || `https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800`} 
                 alt={sport.name}
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
               <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 flex items-center gap-3 md:gap-4">
                 <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-primary shadow-xl">
                   <Trophy size={24} className="md:w-6 md:h-6" />
                 </div>
                 <div>
                   <h3 className="text-white font-display font-black text-lg md:text-2xl tracking-tight">{sport.name}</h3>
                   <p className="text-white/80 text-[9px] md:text-[10px] font-black uppercase tracking-widest">{sport.coach}</p>
                 </div>
               </div>
             </div>

             <div className="p-4 md:p-8 space-y-4 md:space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <Clock size={14} className="text-sky-300" /> Training
                  </div>
                  <p className="text-sm font-bold text-slate-700">{sport.timing}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <MapPin size={14} className="text-sky-300" /> Ground
                  </div>
                  <p className="text-sm font-bold text-slate-700">{sport.location}</p>
                </div>
              </div>

              <div className="p-5 bg-sky-50 rounded-3xl space-y-4 border border-sky-100/50">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Capacity</span>
                  <span className="text-primary">{sport.currentStudents} / {sport.maxStudents}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(sport.currentStudents / (sport.maxStudents || 1)) * 100}%` }}
                    className="bg-primary h-full rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <Package size={18} className="text-slate-300" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Gear</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee</p>
                  <p className="text-2xl font-display font-black text-slate-800">₹{sport.fees}</p>
                </div>
              </div>
            </div>

            <button className="w-full py-5 bg-slate-50 group-hover:bg-primary group-hover:text-white transition-all font-black text-[11px] flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-slate-400 border-t border-slate-100">
              Manage Discipline <ChevronRight size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-10 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                  <Trophy size={28} />
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"><X size={20} /></button>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">New Sport Discipline</h3>
              <p className="text-slate-500 font-medium mb-8">Define a new training category for the academy</p>

              <form onSubmit={handleAddSport} className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Sport Name</label>
                  <input 
                    type="text" required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="e.g. Volleyball"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Lead Coach</label>
                  <input 
                    type="text" required
                    value={formData.coach}
                    onChange={e => setFormData({...formData, coach: e.target.value})}
                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Monthly Fee (₹)</label>
                  <input 
                    type="number" required
                    value={formData.fees}
                    onChange={e => setFormData({...formData, fees: parseInt(e.target.value)})}
                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Max Capacity</label>
                  <input 
                    type="number" required
                    value={formData.maxStudents}
                    onChange={e => setFormData({...formData, maxStudents: parseInt(e.target.value)})}
                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Location</label>
                  <input 
                    type="text" required
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                <button type="submit" className="col-span-2 h-16 sporty-gradient text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 mt-4 active:scale-95 transition-all flex items-center justify-center gap-3">
                  <Save size={20} /> Launch Discipline
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

