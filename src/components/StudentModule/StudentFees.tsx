import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, CreditCard, ChevronDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  sport?: string;
  sportsJoined?: string[];
  feesStatus: 'Paid' | 'Pending';
}

export function StudentFees() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          console.error('Unexpected students response:', data);
          setStudents([]);
        }
      })
      .catch((error) => {
        console.error('Failed to load student fees:', error);
        setStudents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggleFeeStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Paid' ? 'Pending' : 'Paid';
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feesStatus: newStatus })
      });
      if (res.ok) {
        setStudents(students.map(s => s._id === id ? { ...s, feesStatus: newStatus } : s));
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Failed to update fee status:', errorData);
      }
    } catch (err) {
      console.error('Fee status update failed:', err);
    }
  };

  const filteredStudents = students.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Student Fees</h2>
        <p className="text-slate-500 font-medium mt-1">Track and manage student tuition and sports fees</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-card-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-slate-700"
          />
        </div>
        <button className="h-14 px-6 bg-white border border-card-border rounded-2xl flex items-center gap-2 text-slate-500 hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest hover:border-primary/30 hover:shadow-sm">
          <Filter size={18} /> Filter List
        </button>
      </div>

      <div className="bento-card overflow-hidden border-card-border shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-violet-50/40">
              <th className="p-6 border-b border-violet-100 font-black text-[11px] uppercase tracking-widest text-slate-500">Student</th>
              <th className="p-6 border-b border-violet-100 font-black text-[11px] uppercase tracking-widest text-slate-500">Sport</th>
              <th className="p-6 border-b border-violet-100 font-black text-[11px] uppercase tracking-widest text-slate-500">Status</th>
              <th className="p-6 border-b border-violet-100 font-black text-[11px] uppercase tracking-widest text-slate-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="p-6 h-20 bg-slate-50/50 border-b border-card-border" />
                </tr>
              ))
            ) : filteredStudents.map(student => (
              <tr key={student._id} className="hover:bg-violet-50/30 transition-colors group border-b border-card-border last:border-0">
                <td className="p-6 border-b border-card-border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-primary font-black border border-violet-100">
                      {(student.firstName?.[0] || '').toUpperCase()}{(student.lastName?.[0] || '').toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 tracking-tight">{student.firstName} {student.lastName}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 border-b border-card-border">
                  <span className="px-3 py-1 bg-violet-50 text-violet-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-violet-100">
                    {student.sport || student.sportsJoined?.[0] || 'Unassigned'}
                  </span>
                </td>
                <td className="p-6 border-b border-card-border">
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2",
                    student.feesStatus === 'Paid' ? "bg-emerald-50 text-success border border-emerald-100" : "bg-orange-50 text-warning border border-orange-100"
                  )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", student.feesStatus === 'Paid' ? "bg-success" : "bg-warning")} />
                    {student.feesStatus}
                  </span>
                </td>
                <td className="p-6 border-b border-card-border text-right">
                  <button
                    onClick={() => toggleFeeStatus(student._id, student.feesStatus)}
                    className="h-10 px-4 bg-white border border-card-border rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-95 hover:shadow"
                  >
                    Change Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
