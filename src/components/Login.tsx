import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, User, Lock, ArrowRight, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.success) {
        onLogin();
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bento-bg flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bento-card w-full max-w-md overflow-hidden relative shadow-2xl shadow-sky-200/50"
      >
        <div className="p-12 text-center relative z-10">
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl shadow-green-100 mb-8"
          >
            <img src="/input_file_0.png" alt="Vendhan Logo" className="w-full h-full object-cover" />
          </motion.div>
          
          <h1 className="text-4xl font-display font-black text-slate-900 mb-2 tracking-tight uppercase">Vendhan Portal</h1>
          <p className="text-slate-500 mb-10 font-medium">Elite Sports Academy Management</p>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4.5 pl-14 pr-6 focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4.5 pl-14 pr-6 focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="text-danger text-sm font-bold text-center bg-red-50 p-3 rounded-2xl border border-red-100">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-black py-5 rounded-3xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 mt-8 uppercase tracking-widest text-xs"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>SIGN IN TO ACADEMY <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50">
             <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest mb-2">Demo Access</p>
             <div className="flex justify-center gap-4">
               <span className="px-3 py-1 bg-slate-50 rounded-lg text-slate-500 text-[10px] font-bold">admin</span>
               <span className="px-3 py-1 bg-slate-50 rounded-lg text-slate-500 text-[10px] font-bold">admin123</span>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
