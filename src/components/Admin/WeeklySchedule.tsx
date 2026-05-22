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
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Weekly Academy Schedule</h2>
          <p className="text-slate-500 font-medium font-sans mt-1">Manage routine training sessions and discipline timings</p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="sporty-gradient text-white px-7 md:px-8 py-3 md:py-4 rounded-[1.5rem] font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center gap-2"
          >
            <Plus size={20} /> Add Session
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {DAYS.map((day) => {
          const dayItems = schedules.filter(s => s.day === day);
          return (
            <div key={day} className="bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-card-border">
              <h3 className="text-lg md:text-xl font-black text-slate-800 mb-4 md:mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                {day}
              </h3>

              {dayItems.length === 0 ? (
                <p className="text-slate-400 italic text-sm pl-4">No sessions scheduled for this day.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {dayItems.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 md:p-5 bg-violet-50/50 rounded-2xl border border-violet-100/60 relative group"
                    >
                      {isAdmin && (
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-400 hover:text-primary transition-colors bg-white rounded-lg shadow-sm border border-card-border"
                          >
                            <Save size={13} className="rotate-0" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-1.5 text-slate-400 hover:text-danger transition-colors bg-white rounded-lg shadow-sm border border-card-border"
                           >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white p-2 rounded-lg border border-violet-100 shadow-sm text-primary">
                          <Clock size={16} />
                        </div>
                        <span className="font-bold text-slate-800 text-sm tracking-tight">{item.time}</span>
                      </div>

                      <h4 className="text-base md:text-lg font-semibold text-slate-800 mb-2">{item.activity}</h4>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-500 text-[11px] md:text-xs">
                          <User size={11} />
                          <span>Coach: {item.coach}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px] md:text-xs">
                          <MapPin size={11} />
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
               className="absolute inset-0 backdrop-blur-sm"
               style={{ background: 'rgba(124, 58, 237, 0.08)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-[1.75rem] md:rounded-[2rem] shadow-2xl p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-violet-50 flex items-center justify-center text-primary shadow-sm">
                  <Calendar size={22} className="md:w-6 md:h-6" />
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"><X size={20} /></button>
              </div>

              <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight mb-1 md:mb-2">
                {editingId ? 'Update Session' : 'Schedule New Session'}
              </h3>
              <p className="text-slate-500 font-medium mb-6 md:mb-8 text-sm">Set timing and activity for the week plan</p>

              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Day</label>
                    <select
                      value={formData.day}
                      onChange={e => setFormData({...formData, day: e.target.value})}
                      className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
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
                      className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">End Time</label>
                    <input
                      type="text" required placeholder="08:00 AM"
                      value={formData.endTime}
                      onChange={e => setFormData({...formData, endTime: e.target.value})}
                      className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Activity / Discipline</label>
                  <input
                    type="text" required placeholder="e.g. Volleyball Net Practice"
                    value={formData.activity}
                    onChange={e => setFormData({...formData, activity: e.target.value})}
                    className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Lead Coach</label>
                    <input
                      type="text" required
                      value={formData.coach}
                      onChange={e => setFormData({...formData, coach: e.target.value})}
                      className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Location</label>
                    <input
                      type="text" required
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full h-16 sporty-gradient text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-violet-400/20 mt-4 active:scale-95 transition-all flex items-center justify-center gap-3">
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
