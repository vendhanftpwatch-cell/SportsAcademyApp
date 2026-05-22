import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Filter, Edit2, Trash2, Eye, User, Phone, MapPin, Calendar, Activity, CreditCard } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface StudentArchiveProps {
  isAdmin?: boolean;
}

export function StudentArchive({ isAdmin = false }: StudentArchiveProps) {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const fetchData = () => {
    setLoading(true);
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        setStudents(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Failed to fetch students:', error);
        setStudents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

    const handleAddStudent = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const nameParts = String(formData.name || '').trim().split(/\s+/).filter(Boolean);
        const firstName = nameParts.length ? nameParts[0] : '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        const res = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            firstName,
            lastName,
            age: formData.age ? parseInt(formData.age, 10) : undefined,
            gender: formData.gender,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            emergencyContact: formData.emergencyContact,
            emergencyPhone: formData.emergencyPhone
          })
        });
        if (res.ok) {
          setShowAddModal(false);
          setFormData({
            name: '',
            age: '',
            gender: '',
            phone: '',
            email: '',
            address: '',
            emergencyContact: '',
            emergencyPhone: ''
          });
          fetchData();
        } else {
          const errorData = await res.json().catch(() => ({}));
          console.error("Failed to add student:", errorData);
          alert(`Failed to add student: ${errorData.error || 'Unknown error'}${errorData.detail ? ' - ' + errorData.detail : ''}`);
        }
      } catch (error) {
        console.error("Failed to add student:", error);
        alert("Failed to add student: Network error");
      }
    };

  const deleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student record?")) return;
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error(error);
    }
  };

   const filteredStudents = students.filter(s =>
     s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.gender?.toLowerCase().includes(searchTerm.toLowerCase())
   );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800">{isAdmin ? 'Student Archive' : 'Current Student List'}</h2>
          <p className="text-slate-500 font-medium">Manage and view all student records</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="sporty-gradient text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-violet-400/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <Plus size={20} /> Add New Student
          </button>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or sport..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-card-border rounded-2xl py-3 pl-11 md:pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-slate-700"
          />
        </div>
        <button className="bg-white px-4 py-2.5 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors shadow-sm border border-card-border rounded-2xl hover:border-primary/30">
          <Filter size={18} /> <span className="hidden sm:inline font-bold text-sm">Filters</span>
        </button>
      </div>

      {/* Grid of students */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 bento-card animate-pulse" />)
        ) : filteredStudents.map((student) => (
          <motion.div
            key={student._id || student.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bento-card p-0 overflow-hidden group bento-card-hover shadow-sm"
          >
            <div className="p-6 md:p-8">
               <div className="flex items-start justify-between mb-5 md:mb-6">
                 <div className="flex items-center gap-4 md:gap-5">
                   <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-violet-50 p-1 border border-violet-100 shadow-inner">
                     <img
                       src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                       alt="avatar"
                       className="w-full h-full object-cover rounded-xl"
                     />
                   </div>
                   <div>
                     <h3 className="font-display font-black text-lg md:text-xl text-slate-800 leading-tight">{student.name}</h3>
                     <div className="flex gap-2 mt-2">
                       <span className="px-3 py-1 bg-violet-50 text-violet-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-violet-100">
                         {(student.sport || student.sportsJoined?.[0] || 'Unassigned')}
                       </span>
                     </div>
                   </div>
                 </div>
               </div>

              <div className="space-y-3 md:space-y-4">
                 <div className="flex items-center gap-3 text-slate-500">
                   <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-card-border">
                     <User size={16} />
                   </div>
                   <span className="text-sm font-semibold">{student.parentName || 'N/A'}</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-500">
                   <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-card-border">
                     <Phone size={16} />
                   </div>
                   <span className="text-sm font-semibold">{student.phone || 'N/A'}</span>
                 </div>
               </div>

              <div className="mt-8 pt-6 border-t border-card-border flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Joining Date</p>
                  <p className="text-sm font-semibold text-slate-600">
                    {new Date(student.dateJoined || student.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => deleteStudent(student._id)}
                        className="p-2 text-slate-300 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-slate-300 hover:text-primary hover:bg-violet-50 rounded-lg transition-all">
                        <Edit2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div style={{ background: 'rgba(124, 58, 237, 0.08)' }} className="absolute inset-0" onClick={() => setShowAddModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 md:p-8"
          >
            <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-5 md:mb-6">Register New Student</h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text" placeholder="Full Name" required
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                />
                <input
                  type="number" placeholder="Age" required
                  value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})}
                  className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
                  className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="tel" placeholder="Phone Number" required
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                />
              </div>
              <input
                type="email" placeholder="Email Address" required
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
              />
              <input
                type="text" placeholder="Address" required
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text" placeholder="Emergency Contact Name" required
                  value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})}
                  className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                />
                <input
                  type="tel" placeholder="Emergency Phone" required
                  value={formData.emergencyPhone} onChange={e => setFormData({...formData, emergencyPhone: e.target.value})}
                  className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                />
              </div>
              <button type="submit" className="w-full h-14 sporty-gradient text-white rounded-2xl font-black uppercase tracking-widest mt-4 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                Confirm Registration
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
