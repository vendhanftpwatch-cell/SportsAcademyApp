import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UserCog, Phone, Mail, Award, Clock, DollarSign, Calendar, Sliders, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CoachManagementProps {
  isAdmin?: boolean;
}

export function CoachManagement({ isAdmin = false }: CoachManagementProps) {
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sport: 'Football',
    experience: '3 Years',
    phone: '',
    email: '',
    salary: 25000,
    workingHours: '06:00 AM - 09:00 AM'
  });

  const fetchData = () => {
    setLoading(true);
    fetch('/api/coaches')
      .then(res => res.json())
      .then(data => {
        setCoaches(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Failed to fetch coaches:', error);
        setCoaches([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/coaches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowAddModal(false);
        setFormData({
          name: '',
          sport: 'Football',
          experience: '3 Years',
          phone: '',
          email: '',
          salary: 25000,
          workingHours: '06:00 AM - 09:00 AM'
        });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCoach = async (id: string) => {
    if (!confirm("Remove this coach from the directory?")) return;
    try {
      await fetch(`/api/coaches/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 h-full font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Coach Directory</h2>
          <p className="text-slate-500 font-medium text-sm md:text-base">Professional staff and training assignments</p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2 md:gap-4">
           {isAdmin && (
             <button 
               onClick={() => setShowAddModal(true)}
               className="bg-indigo-600 text-white px-5 md:px-8 py-2.5 md:py-3.5 rounded-2xl md:rounded-3xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-transform min-h-[40px] md:min-h-[44px]"
             >
               + RECRUIT COACH
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {loading ? (
          [1, 2].map(i => <div key={i} className="h-60 md:h-64 bento-card animate-pulse" />)
        ) : coaches.map((coach, i) => (
          <motion.div 
            key={coach._id || i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bento-card p-4 md:p-8 group bento-card-hover relative shadow-sm"
          >
            {isAdmin && (
              <button 
                onClick={() => deleteCoach(coach._id)}
                className="absolute top-4 md:top-6 right-4 md:right-6 p-1.5 md:p-2 text-slate-300 hover:text-red-500 transition-colors z-20"
              >
                <Trash2 size={16} className="md:w-4.5 md:h-4.5" />
              </button>
            )}
            <div className="flex flex-col xs:flex-row gap-4 md:gap-8 items-start relative z-10">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-sky-50 p-1 border border-sky-100 shadow-inner">
                <img 
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${coach.name}`} 
                  alt="avatar" 
                  className="w-full h-full object-cover rounded-xl md:rounded-2xl"
                />
              </div>
              
              <div className="flex-1 w-full">
                <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start mb-3 md:mb-4 gap-2 xs:gap-0">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">{coach.name}</h3>
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-purple-100">{coach.sport} Expert</span>
                  </div>
                  {isAdmin && <button className="p-2 text-slate-300 hover:text-primary transition-colors self-start xs:self-auto"><Sliders size={18} className="md:w-5 md:h-5" /></button>}
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-y-3 md:gap-y-4 gap-x-4 md:gap-x-8">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Award size={16} className="md:w-4.5 md:h-4.5 text-indigo-400" />
                    <span className="text-xs md:text-sm font-bold">{coach.experience} Exp.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone size={16} className="md:w-4.5 md:h-4.5 text-indigo-400" />
                    <span className="text-xs md:text-sm font-bold">{coach.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock size={16} className="md:w-4.5 md:h-4.5 text-indigo-400" />
                    <span className="text-xs md:text-sm font-bold">{coach.workingHours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar size={16} className="md:w-4.5 md:h-4.5 text-indigo-400" />
                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[10px] md:text-[11px]">Since {coach.joiningDate}</span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-100 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4 xs:gap-0">
                    <div>
                      <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Salary</p>
                      <div className="flex items-center gap-1 text-slate-800">
                        <DollarSign size={16} className="text-green-500 font-black md:w-4.5 md:h-4.5" />
                        <span className="text-lg md:text-xl font-black">{coach.salary}</span>
                      </div>
                    </div>
                    <div className="flex flex-col xs:flex-row gap-2">
                       <button 
                         onClick={() => navigate('/attendance/coaches')}
                         className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-[10px] font-black bg-indigo-50 text-primary hover:bg-primary hover:text-white transition-colors uppercase tracking-widest min-h-[36px]"
                       >
                         Attendance
                       </button>
                       <button 
                         onClick={() => navigate('/coaches/pay')}
                         className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-[10px] font-black bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors uppercase tracking-widest min-h-[36px]"
                       >
                         Payrolls
                       </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Recruitment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-800">Recruit New Coach</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAddCoach} className="space-y-4">
              <input 
                type="text" placeholder="Full Name" required
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold outline-none ring-primary/20 focus:ring-2 focus:border-primary text-slate-800"
              />
              <div className="grid grid-cols-2 gap-4">
                <select 
                  value={formData.sport} onChange={e => setFormData({...formData, sport: e.target.value})}
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold outline-none ring-primary/20 focus:ring-2 focus:border-primary text-slate-800"
                >
                  <option>Football</option>
                  <option>Tennis</option>
                  <option>Swimming</option>
                  <option>Cricket</option>
                </select>
                <input 
                  type="text" placeholder="Experience" required
                  value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})}
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold outline-none ring-primary/20 focus:ring-2 focus:border-primary text-slate-800"
                />
              </div>
              <input 
                type="email" placeholder="Email Address" required
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold outline-none ring-primary/20 focus:ring-2 focus:border-primary text-slate-800"
              />
              <input 
                type="tel" placeholder="Phone Number" required
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold outline-none ring-primary/20 focus:ring-2 focus:border-primary text-slate-800"
              />
              <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Monthly Salary (₹)</label>
                 <input 
                   type="number" required
                   value={formData.salary} onChange={e => setFormData({...formData, salary: parseInt(e.target.value)})}
                   className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-black outline-none ring-primary/20 focus:ring-2 focus:border-primary text-slate-800"
                 />
              </div>
              <button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest mt-4 transition-colors">
                Confirm Recruitment
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
