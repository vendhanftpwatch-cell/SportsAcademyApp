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
        const apiBase = import.meta.env.VITE_API_BASE_URL?.trim() || window.location.origin;
        const apiUrl = `${apiBase}/api/login`;
        const response = await fetch(apiUrl, {
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Decorative Elements */}
      <div className="absolute top-[-5%] left-[-2%] w-48 h-48 sm:w-64 sm:h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-5%] right-[-2%] w-64 h-64 sm:w-96 sm:h-96 bg-rose-500/10 rounded-full blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-sm sm:max-w-md overflow-hidden relative shadow-2xl shadow-indigo-500/10 rounded-[2rem] p-8 sm:p-12 sm:rounded-[2.5rem]"
      >
        <div className="p-8 sm:p-12 text-center relative z-10">
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl flex items-center justify-center overflow-hidden shadow-xl neon-primary mb-6 sm:mb-8 vibrant-indigo"
          >
            <img src="/logo.png" alt="Vendhan Logo" className="w-full h-full object-cover" />
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 mb-2 tracking-tight uppercase">Vendhan Portal</h1>
          <p className="text-slate-500 mb-8 sm:mb-10 font-medium text-sm sm:text-base">Elite Sports Academy Management</p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 sm:pl-14 pr-4 focus:ring-4 focus:ring-primary/15 focus:bg-primary/5 focus:border-primary outline-none transition-all font-bold text-slate-800 placeholder:text-slate-400 touch-target"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 sm:pl-14 pr-4 focus:ring-4 focus:ring-primary/15 focus:bg-primary/5 focus:border-primary outline-none transition-all font-bold text-slate-800 placeholder:text-slate-400 touch-target"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="text-danger text-sm font-bold text-center bg-rose-50 p-3 rounded-2xl border border-rose-100">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full sporty-gradient text-white font-black py-4 sm:py-5 rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 mt-6 sm:mt-8 uppercase tracking-widest text-xs touch-target"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>SIGN IN TO ACADEMY <ArrowRight size={16} className="sm:w-4.5 sm:h-4.5" /></>}
            </button>
          </form>

          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-100">
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Demo Access</p>
             <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-700 text-[10px] font-bold border border-slate-200">admin</span>
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-700 text-[10px] font-bold border border-slate-200">admin123</span>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}