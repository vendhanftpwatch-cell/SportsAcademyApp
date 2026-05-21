import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Minus, 
  Download, 
  Printer, 
  Plus, 
  Trash2, 
  Edit2,
  Save,
  UserPlus
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  name?: string;
  sport?: string;
  sportsJoined?: string[];
  age?: number;
}

interface AttendanceRecord {
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'leave';
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const years = Array.from({ length: 5 }, (_, i) => 2024 + i);

interface StudentAttendanceProps {
  isAdmin?: boolean;
}

export function StudentAttendance({ isAdmin = false }: StudentAttendanceProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 1)); // May 2024
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', sport: 'Football' });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const [attendanceData, setAttendanceData] = useState<Record<string, 'present' | 'absent' | 'leave'>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [studentsRes, attendanceRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/attendance?type=student')
      ]);
      const studentsData = await studentsRes.json();
      const attendanceDataRaw = await attendanceRes.json();
      
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      
      const attendanceArray = Array.isArray(attendanceDataRaw) ? attendanceDataRaw : [];
      const transformed: Record<string, 'present' | 'absent' | 'leave'> = {};
      attendanceArray.forEach((rec: any) => {
        if (rec?.studentId && rec?.date && rec?.status) {
          transformed[`${rec.studentId}-${new Date(rec.date).toISOString().slice(0, 10)}`] = rec.status;
        }
      });
      setAttendanceData(transformed);
    } catch (error) {
      console.error("Failed to fetch student attendance data:", error);
      setStudents([]);
      setAttendanceData({});
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (studentId: string, day: number) => {
    if (!isAdmin) return; // Prevent non-admins from modifying
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    
    const key = `${studentId}-${dateStr}`;
    const current = attendanceData[key] || 'present';
    const next: 'present' | 'absent' | 'leave' = 
      current === 'present' ? 'absent' : 
      current === 'absent' ? 'leave' : 'present';
    
    // Optimistic update
    setAttendanceData(prev => ({ ...prev, [key]: next }));

    try {
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, date: dateStr, status: next, type: 'student' })
      });
    } catch (error) {
      console.error("Failed to save attendance:", error);
      // Revert on error
      setAttendanceData(prev => ({ ...prev, [key]: current }));
    }
  };

  const getStatus = (studentId: string, day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    const key = `${studentId}-${dateStr}`;
    return attendanceData[key] || 'present';
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          sportsJoined: [formData.sport]
        })
      });
      if (res.ok) {
        setShowAddModal(false);
        setFormData({ firstName: '', lastName: '', sport: 'Football' });
        fetchData(); // Refresh the list from the server to get DB IDs
      }
    } catch (error) {
      console.error("Failed to add student:", error);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      const res = await fetch(`/api/students/${editingStudent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          sportsJoined: [formData.sport]
        })
      });
      if (res.ok) {
        setEditingStudent(null);
        setFormData({ firstName: '', lastName: '', sport: 'Football' });
        fetchData();
      }
    } catch (error) {
      console.error("Failed to update student:", error);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      setStudents(students.filter(s => s._id !== id));
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  const filteredStudents = selectedSport === 'All Sports' 
    ? students 
    : students.filter(s => {
        const sport = s.sport || s.sportsJoined?.[0] || '';
        return sport === selectedSport;
      });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(year, parseInt(e.target.value), 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(parseInt(e.target.value), month, 1));
  };

  return (
    <div className="flex flex-col gap-6 h-full font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Attendance Sheet</h2>
          <p className="text-slate-500 font-medium leading-none mt-1">Real-time tracking for active sports disciplines</p>
        </div>
        <div className="flex gap-4">
          {isAdmin && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="h-12 bg-primary text-white px-6 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <UserPlus size={16} /> Add Student
            </button>
          )}
          <button className="h-12 bg-white border border-slate-200 px-6 rounded-2xl text-slate-500 hover:text-primary hover:border-primary/30 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrevMonth}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            <select 
              value={month}
              onChange={handleMonthChange}
              className="font-black text-lg text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer hover:text-primary transition-colors appearance-none pr-0"
            >
              {months.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
            <select 
              value={year}
              onChange={handleYearChange}
              className="font-black text-lg text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer hover:text-primary transition-colors appearance-none"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sport:</span>
            <select 
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-black text-primary px-4 py-2 outline-none uppercase tracking-widest"
            >
              <option>All Sports</option>
              <option>Football</option>
              <option>Tennis</option>
              <option>Swimming</option>
              <option>Cricket</option>
            </select>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <div className="flex gap-6">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Absent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Leave</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bento-card overflow-hidden border-slate-200/50 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1240px]">
            <thead>
              <tr className="bg-indigo-50/50">
                <th className="sticky left-0 z-20 bg-indigo-50/50 p-6 border-b border-indigo-100 font-display font-black text-[11px] uppercase tracking-widest text-slate-500 min-w-[260px]">Student Name</th>
                {days.map(day => (
                  <th key={day} className="p-2 border-b border-indigo-100 text-center font-black text-[10px] text-slate-400 min-w-[40px]">{day}</th>
                ))}
                <th className="p-4 border-b border-indigo-100 font-display font-black text-[11px] uppercase tracking-widest text-slate-500 text-center">% Rate</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student._id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="sticky left-0 z-20 bg-white group-hover:bg-indigo-50 transition-colors p-6 border-b border-slate-100 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner group-hover:bg-white transition-colors">
                          <Check size={18} className="text-primary/50" />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 tracking-tight">{student.firstName} {student.lastName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">{student.sport || student.sportsJoined?.[0] || 'Unassigned'}</p>
                        </div>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingStudent(student);
                              setFormData({ firstName: student.firstName, lastName: student.lastName, sport: student.sport || student.sportsJoined?.[0] || 'Football' });
                            }}
                            className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-primary transition-colors shadow-sm"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteStudent(student._id)}
                            className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  {days.map(day => {
                    const status = getStatus(student._id, day);
                    return (
                      <td key={day} className="p-1 border-b border-slate-100 text-center">
                        <div 
                          onClick={() => toggleStatus(student._id, day)}
                          className={cn(
                            "w-7 h-7 rounded-lg mx-auto flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-sm active:scale-95",
                            status === 'present' ? "bg-green-500 text-white" : 
                            status === 'absent' ? "bg-rose-500 text-white" : "bg-warning text-white"
                          )}
                        >
                          {status === 'present' ? <Check size={14} /> : status === 'absent' ? <X size={14} /> : <Minus size={14} />}
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-4 border-b border-slate-100 text-center font-black text-slate-800 text-sm">
                    {Math.round((days.filter(d => getStatus(student._id, d) === 'present').length / days.length) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {(showAddModal || editingStudent) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowAddModal(false);
                setEditingStudent(null);
              }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {editingStudent ? 'Edit Student' : 'Add New Student'}
                  </h3>
                  <button 
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingStudent(null);
                    }}
                    className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                <form onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">First Name</label>
                      <input 
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-300"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Last Name</label>
                      <input 
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-300"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Sport</label>
                    <select 
                      value={formData.sport}
                      onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                      className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option>Football</option>
                      <option>Tennis</option>
                      <option>Swimming</option>
                      <option>Cricket</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="w-full h-14 bg-primary hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {editingStudent ? <Save size={16} /> : <Plus size={16} />}
                    {editingStudent ? 'Save Changes' : 'Create Student Record'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
     </div>
   );
}
