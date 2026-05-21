import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Check, X, Minus, Download, UserCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Coach {
  _id: string;
  name: string;
  sport: string;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const years = Array.from({ length: 5 }, (_, i) => 2024 + i);

export function CoachAttendance() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 1)); // May 2024
  const [attendanceData, setAttendanceData] = useState<Record<string, 'present' | 'absent' | 'leave'>>({});
  const [loading, setLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coachesRes, attendanceRes] = await Promise.all([
        fetch('/api/coaches'),
        fetch('/api/attendance?type=coach')
      ]);
      const coachesData = await coachesRes.json();
      const attendanceDataRaw = await attendanceRes.json();
      
      setCoaches(Array.isArray(coachesData) ? coachesData : []);
      
      const attendanceArray = Array.isArray(attendanceDataRaw) ? attendanceDataRaw : [];
      const transformed: Record<string, 'present' | 'absent' | 'leave'> = {};
      attendanceArray.forEach((rec: any) => {
        if (rec?.coachId && rec?.date && rec?.status) {
          transformed[`${rec.coachId}-${new Date(rec.date).toISOString().slice(0, 10)}`] = rec.status;
        }
      });
      setAttendanceData(transformed);
    } catch (error) {
      console.error("Failed to fetch coach attendance data:", error);
      setCoaches([]);
      setAttendanceData({});
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (coachId: string, day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    
    const key = `${coachId}-${dateStr}`;
    const current = attendanceData[key] || 'present';
    const next: 'present' | 'absent' | 'leave' = 
      current === 'present' ? 'absent' : 
      current === 'absent' ? 'leave' : 'present';
    
    setAttendanceData(prev => ({ ...prev, [key]: next }));

    try {
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coachId, date: dateStr, status: next, type: 'coach' })
      });
    } catch (error) {
      console.error("Failed to save attendance:", error);
      setAttendanceData(prev => ({ ...prev, [key]: current }));
    }
  };

  const getStatus = (coachId: string, day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    const key = `${coachId}-${dateStr}`;
    return attendanceData[key] || 'present';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight text-secondary">Coach Attendance</h2>
          <p className="text-slate-500 font-medium leading-none mt-1">Staff presence tracking and duty records</p>
        </div>
        <button className="h-12 bg-white border border-slate-200 px-6 rounded-2xl text-secondary hover:bg-rose-50 hover:border-rose-200 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md">
          <Download size={16} /> Export Logs
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 hover:bg-indigo-50 rounded-xl transition-colors text-slate-400 hover:text-secondary"><ChevronLeft size={20} /></button>
          <div className="flex items-center gap-2">
            <span className="font-black text-lg text-slate-700">{months[month]} {year}</span>
          </div>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 hover:bg-indigo-50 rounded-xl transition-colors text-slate-400 hover:text-secondary"><ChevronRight size={20} /></button>
        </div>
        
        <div className="flex gap-6">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Present</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-500" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Absent</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-warning" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Leave</span></div>
        </div>
      </div>

      <div className="bento-card overflow-hidden border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1240px]">
            <thead>
              <tr className="bg-indigo-50/30">
                <th className="sticky left-0 z-20 bg-indigo-50/30 p-6 border-b border-indigo-100 font-black text-[11px] uppercase tracking-widest text-slate-500 min-w-[260px]">Coach Name</th>
                {days.map(day => (
                  <th key={day} className="p-2 border-b border-indigo-100 text-center font-black text-[10px] text-slate-400 min-w-[40px]">{day}</th>
                ))}
                <th className="p-4 border-b border-indigo-100 font-black text-[11px] uppercase tracking-widest text-slate-500 text-center">Rate</th>
              </tr>
            </thead>
            <tbody>
              {coaches.map(coach => (
                <tr key={coach._id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="sticky left-0 z-20 bg-white group-hover:bg-indigo-50 transition-colors p-6 border-b border-slate-100 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-secondary border border-rose-100 shadow-inner group-hover:bg-white transition-colors">
                        <UserCheck size={18} className="text-secondary/50" />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 tracking-tight">{coach.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{coach.sport}</p>
                      </div>
                    </div>
                  </td>
                  {days.map(day => {
                    const status = getStatus(coach._id, day);
                    return (
                      <td key={day} className="p-1 border-b border-slate-100 text-center">
                        <div 
                          onClick={() => toggleStatus(coach._id, day)}
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
                    {Math.round((days.filter(d => getStatus(coach._id, d) === 'present').length / days.length) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
