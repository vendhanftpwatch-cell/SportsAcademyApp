import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Plus, Trash2, X, Save, Clock, MapPin, User } from 'lucide-react';

interface ScheduleItem {
  _id: string;
  day: string;
  time: string;
  activity: string;
  coach: string;
  location: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function WeeklySchedule({ isAdmin = false }: { isAdmin?: boolean }) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    day: 'Monday',
    startTime: '06:00 AM',
    endTime: '07:30 AM',
    activity: '',
    coach: '',
    location: 'Main Ground'
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/schedules');
      const data = await res.json();
      setSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      day: 'Monday',
      startTime: '06:00 AM',
      endTime: '07:30 AM',
      activity: '',
      coach: '',
      location: 'Main Ground'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: ScheduleItem) => {
    setEditingId(item._id);
    const [start, end] = item.time.split(' - ');
    setFormData({
      day: item.day,
      startTime: start || item.time,
      endTime: end || '07:30 AM',
      activity: item.activity,
      coach: item.coach,
      location: item.location
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/schedules/${editingId}` : '/api/schedules';
      const method = editingId ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        time: `${formData.startTime} - ${formData.endTime}`
      };
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowAddModal(false);
        setEditingId(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this schedule item?')) return;
    try {
      await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Weekly Academy Schedule</h2>
          <p className="text-slate-500 font-medium font-sans">Manage routine training sessions and discipline timings</p>
        </div>
        {isAdmin && (
          <button 
            onClick={handleOpenAdd}
            className="sporty-gradient text-white px-8 py-4 rounded-[2rem] font-bold shadow-xl shadow-blue-100 flex items-center gap-2 hover:scale-105 transition-transform active:scale-95"
          >
            <Plus size={20} /> Add Session
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {DAYS.map((day) => {
          const dayItems = schedules.filter(s => s.day === day);
          return (
            <div key={day} className="bento-card p-8">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                {day}
              </h3>
              
              {dayItems.length === 0 ? (
                <p className="text-slate-400 italic text-sm pl-4">No sessions scheduled for this day.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dayItems.map((item) => (
                    <motion.div 
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-5 bg-sky-50/50 rounded-3xl border border-sky-100 relative group"
                    >
                      {isAdmin && (
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 text-slate-400 hover:text-primary transition-colors bg-white rounded-xl shadow-sm border border-slate-100"
                          >
                            <Save size={14} className="rotate-0" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-xl shadow-sm border border-slate-100"
                           >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white p-2 rounded-xl border border-sky-100 shadow-sm text-primary">
                          <Clock size={16} />
                        </div>
                        <span className="font-black text-slate-800 text-sm tracking-tight">{item.time}</span>
                      </div>
                      
                      <h4 className="text-lg font-bold text-slate-900 mb-2">{item.activity}</h4>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <User size={12} />
                          <span>Coach: {item.coach}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <MapPin size={12} />
                          <span>Location: {item.location}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
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
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-primary shadow-inner">
                  <Calendar size={28} />
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"><X size={20} /></button>
              </div>

              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                {editingId ? 'Update Session' : 'Schedule New Session'}
              </h3>
              <p className="text-slate-500 font-medium mb-8">Set timing and activity for the week plan</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Day</label>
                    <select 
                      value={formData.day}
                      onChange={e => setFormData({...formData, day: e.target.value})}
                      className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                    >
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Start Time</label>
                    <input 
                      type="text" required placeholder="06:00 AM"
                      value={formData.startTime}
                      onChange={e => setFormData({...formData, startTime: e.target.value})}
                      className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">End Time</label>
                    <input 
                      type="text" required placeholder="08:00 AM"
                      value={formData.endTime}
                      onChange={e => setFormData({...formData, endTime: e.target.value})}
                      className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Activity / Discipline</label>
                  <input 
                    type="text" required placeholder="e.g. Volleyball Net Practice"
                    value={formData.activity}
                    onChange={e => setFormData({...formData, activity: e.target.value})}
                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
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
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Location</label>
                    <input 
                      type="text" required
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full h-16 sporty-gradient text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 mt-4 active:scale-95 transition-all flex items-center justify-center gap-3">
                  <Save size={20} /> Save to Schedule
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
