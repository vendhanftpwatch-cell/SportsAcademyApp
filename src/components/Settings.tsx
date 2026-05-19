import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, Palette, Database, Info, LogOut } from 'lucide-react';

export function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-slate-800">Account Settings</h2>
        <p className="text-slate-500 font-medium">Manage your academy profile and system preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="glass-card p-4 flex items-center gap-4 bg-primary text-white border-none shadow-blue-100">
            <Info size={24} />
            <div>
              <p className="text-xs font-bold opacity-70 uppercase">Profile</p>
              <h4 className="font-bold">Academy Info</h4>
            </div>
          </div>
          {[
            { icon: Shield, label: 'Security' },
            { icon: Bell, label: 'Notifications' },
            { icon: Palette, label: 'Appearance' },
            { icon: Database, label: 'Data Backup' },
          ].map(item => (
            <div key={item.label} className="glass-card p-4 flex items-center gap-4 text-slate-500 hover:text-primary transition-colors cursor-pointer group">
              <item.icon size={24} className="group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="font-bold">{item.label}</h4>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 space-y-8">
           <div className="glass-card p-8 space-y-6">
              <h3 className="text-xl font-display font-bold text-slate-800 border-b border-slate-50 pb-4">General Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Academy Name</label>
                  <input type="text" defaultValue="Elite Sports Academy" className="bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Location Address</label>
                  <input type="text" defaultValue="123 Sporty Way, Champion City" className="bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                   <div className="flex flex-col gap-2">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
                     <input type="email" defaultValue="admin@eliteacademy.com" className="bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                     <input type="text" defaultValue="+1 234 567 890" className="bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700" />
                   </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4">
                <button className="px-6 py-3 rounded-2xl font-bold text-slate-400 hover:bg-slate-100 transition-colors">Discard</button>
                <button className="sporty-gradient text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100">Save Changes</button>
              </div>
           </div>

           <div className="glass-card p-8 bg-red-50/30 border-red-100 space-y-6">
              <h3 className="text-xl font-display font-bold text-danger">Privacy & Security</h3>
              <p className="text-sm text-slate-500 font-medium">Update your administrative credentials and manage session persistence.</p>
              <div className="flex flex-col gap-4">
                 <button className="w-full bg-white border border-red-100 text-danger py-4 rounded-2xl font-bold text-sm hover:bg-danger hover:text-white transition-all flex items-center justify-center gap-2">
                    <Shield size={18} /> Update Admin Password
                 </button>
                 <button className="w-full bg-white border border-slate-100 text-slate-400 py-4 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                    <LogOut size={18} /> Terminate All Active Sessions
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
