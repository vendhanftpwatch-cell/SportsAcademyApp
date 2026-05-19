import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Plus, ChevronRight, CheckCircle2, Clock, History, IndianRupee, X, Save } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Coach {
  _id: string;
  name: string;
  salary: number;
  sport: string;
}

interface Payment {
  _id: string;
  coachId: Coach;
  amount: number;
  date: string;
  month: string;
  status: 'Paid' | 'Pending';
  notes: string;
}

export function CoachPay() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  
  const [formData, setFormData] = useState({
    amount: 0,
    month: 'May 2024',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coachesRes, paymentsRes] = await Promise.all([
        fetch('/api/coaches'),
        fetch('/api/payments')
      ]);
      const c = await coachesRes.json();
      const p = await paymentsRes.json();
      setCoaches(c);
      setPayments(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoach) return;
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coachId: selectedCoach._id,
          ...formData
        })
      });
      if (res.ok) {
        setShowPayModal(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Coach Payroll</h2>
        <p className="text-slate-500 font-medium mt-1">Manage salaries, payments and disbursement history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Recent Transactions</h3>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-50/50 animate-pulse rounded-3xl" />)
            ) : payments.length === 0 ? (
              <div className="p-12 text-center glass-card border-dashed">
                <History className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No transaction history found</p>
              </div>
            ) : payments.slice(0, 5).map(payment => (
              <motion.div 
                key={payment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-50 p-6 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 tracking-tight">{payment.coachId?.name || 'Unknown'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{payment.month}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 text-lg">₹{payment.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-300 font-bold uppercase mt-1 leading-none">{new Date(payment.date).toLocaleDateString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Coach List</h3>
          <div className="bg-white border border-slate-50 rounded-[32px] p-6 shadow-sm divide-y divide-slate-50">
            {coaches.map(coach => (
              <div key={coach._id} className="py-5 first:pt-0 last:pb-0 flex items-center justify-between group">
                <div>
                  <p className="font-black text-slate-800 tracking-tight">{coach.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">₹{coach.salary?.toLocaleString()} / mo</p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedCoach(coach);
                    setFormData({ ...formData, amount: coach.salary });
                    setShowPayModal(true);
                  }}
                  className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
                >
                  <Plus size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPayModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPayModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-primary mb-4 shadow-inner">
                  <Wallet size={28} />
                </div>
                <button onClick={() => setShowPayModal(false)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><X size={20} /></button>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Process Payment</h3>
              <p className="text-slate-500 font-medium mb-8">Release salary payment for <span className="text-slate-800 font-black">{selectedCoach?.name}</span></p>

              <form onSubmit={handlePayment} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Amount (₹)</label>
                  <input 
                    type="number" required
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: parseInt(e.target.value)})}
                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-black text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none text-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Payment Month</label>
                  <input 
                    type="text" required
                    value={formData.month}
                    onChange={e => setFormData({...formData, month: e.target.value})}
                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="e.g. May 2024"
                  />
                </div>

                <button type="submit" className="w-full h-16 sporty-gradient text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 mt-4 active:scale-95 transition-all flex items-center justify-center gap-3">
                  <Save size={20} /> Authorize Payment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
