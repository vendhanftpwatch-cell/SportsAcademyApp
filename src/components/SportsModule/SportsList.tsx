import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Users, Clock, MapPin, Package, UserCheck, ChevronRight, Plus, X, Trash2, Edit2, Save, Upload, Camera, FileImage, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { processImageOcr, type OcrStudentData } from '@/src/services/ocrService';

interface Sport {
  _id: string;
  name: string;
  coach: string;
  timing: string;
  location: string;
  maxStudents: number;
  currentStudents: number;
  fees: number;
  image?: string;
}

interface SportsListProps {
  isAdmin?: boolean;
}

export function SportsList({ isAdmin = false }: SportsListProps) {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrData, setOcrData] = useState<OcrStudentData | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    coach: '',
    timing: '06:00 AM - 08:00 AM',
    location: 'Main Ground',
    maxStudents: 30,
    fees: 1500,
    image: '' // Added image field to form data
  });

   const fetchData = () => {
     setLoading(true);
     fetch('/api/sports')
       .then(res => res.json())
       .then(data => {
         setSports(Array.isArray(data) ? data : []);
       })
       .catch(error => {
         console.error('Failed to fetch sports:', error);
         setSports([]);
       })
       .finally(() => {
         setLoading(false);
       });
   };
   
   const handleFileUpload = async (file: File) => {
     if (!file) return;
     const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
     if (!validTypes.includes(file.type)) {
       alert('Please upload JPG, PNG, or PDF files only');
       return;
     }
 
     setOcrLoading(true);
     setPreviewUrl(URL.createObjectURL(file));
     
     try {
       const result = await processImageOcr(file);
       setOcrData(result);
       
       // Map OCR data to sport form fields where possible
       // Note: OCR is designed for student forms, so we'll map what we can
       setFormData({
         name: result.sportsSelected.value || '', // Sport name from sports selected
         coach: result.parentName.value || '', // Parent name as coach (best guess)
         timing: formData.timing, // Keep default timing
         location: result.permanentAddress.value?.split(',')[0] || formData.location, // First part of address
         maxStudents: formData.maxStudents, // Keep default
         fees: formData.fees, // Keep default
         image: '' // No image from OCR
       });
     } catch (error) {
       console.error('OCR processing failed:', error);
       alert('Failed to process image. Please try again.');
     } finally {
       setOcrLoading(false);
     }
   };
   
   const handleOcrCapture = () => {
     fileInputRef.current?.click();
   };

  useEffect(() => {
    fetchData();
  }, []);

   const handleAddSport = async (e: React.FormEvent) => {
     e.preventDefault();
     try {
       const res = await fetch('/api/sports', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(formData)
       });
       if (res.ok) {
         setShowAddModal(false);
         setFormData({
           name: '',
           coach: '',
           timing: '06:00 AM - 08:00 AM',
           location: 'Main Ground',
           maxStudents: 30,
           fees: 1500,
           image: '' // Reset image field
         });
         setOcrData(null);
         setPreviewUrl(null);
         fetchData();
       }
     } catch (err) {
       console.error(err);
     }
   };

  const deleteSport = async (id: string) => {
    if (!confirm("Remove this sport from the academy?")) return;
    try {
      await fetch(`/api/sports/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-800 tracking-tight">Sports Categories</h2>
          <p className="text-slate-500 font-medium text-sm md:text-base">Explore all training disciplines at our academy</p>
        </div>
        {isAdmin && (
            <>
              <button
                onClick={() => setShowOcrModal(true)}
                className="bg-white text-primary border border-primary px-5 md:px-8 py-3 md:py=4 rounded-2xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center gap-2 touch-target"
              >
                <Upload size={16} className="md:w-5 md:h-5" /> Upload Form
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="sporty-gradient text-white px-5 md:px-8 py-3 md:py=4 rounded-2xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center gap-2 touch-target"
              >
                <Plus size={16} className="md:w-5 md:h-5" /> New Discipline
              </button>
            </>
          )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-64 md:h-80 bento-card animate-pulse shadow-md rounded-2xl" />
          ))
        ) : sports.map((sport, i) => (
          <motion.div
            key={sport._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bento-card p-0 overflow-hidden group bento-card-hover relative shadow-sm"
          >
            {isAdmin && (
              <button
                onClick={() => deleteSport(sport._id)}
                className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-md rounded-xl text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger hover:text-white shadow-md touch-target"
              >
                <Trash2 size={16} />
              </button>
            )}
            <div className="h-40 sm:h-44 relative overflow-hidden">
              <img
                src={sport.image || `https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800`}
                alt={sport.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-violet-900/50 to-transparent"></div>
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center justify-center text-primary shadow-md">
                  <Trophy size={22} className="md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-display font-black text-lg md:text-2xl tracking-tight">{sport.name}</h3>
                  <p className="text-white/80 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{sport.coach}</p>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-8 space-y-4 md:space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <Clock size={13} className="text-primary" /> Training
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{sport.timing}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <MapPin size={13} className="text-primary" /> Ground
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{sport.location}</p>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-violet-50/80 rounded-2xl space-y-3 md:space-y-4 border border-violet-100">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Capacity</span>
                  <span className="text-primary">{sport.currentStudents} / {sport.maxStudents}</span>
                </div>
                <div className="w-full bg-violet-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(sport.currentStudents / (sport.maxStudents || 1)) * 100}%` }}
                    className="h-full sporty-gradient rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 md:pt-4">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-slate-400" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Full Gear</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fee</p>
                  <p className="text-2xl font-display font-black text-slate-800">₹{sport.fees}</p>
                </div>
              </div>
            </div>

            <button className="w-full py-5 bg-slate-50 group-hover:bg-violet-50 group-hover:text-primary transition-all text-[11px] font-bold flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-slate-500 border-t border-card-hover hover:border-violet-200">
              Manage Discipline <ChevronRight size={16} />
            </button>
          </motion.div>
        ))}
           </div>

       <AnimatePresence>
         {showAddModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowAddModal(false)}
               className="absolute inset-0" style={{ background: 'rgba(124, 58, 237, 0.08)' }}
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
               className="relative w-full max-w-lg bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl p-8 md:p-10 overflow-hidden border border-card-border"
             >
               <div className="flex items-center justify-between mb-6 md:mb-8">
                 <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-violet-50 flex items-center justify-center text-primary shadow-inner">
                   <Trophy size={24} className="md:w-7 md:h-7" />
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 touch-target"><X size={20} /></button>
               </div>

               <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mb-1 md:mb-2">New Sport Discipline</h3>
               <p className="text-slate-500 font-medium mb-6 md:mb-8">Define a new training category for the academy</p>

               <form onSubmit={handleAddSport} className="grid grid-cols-2 gap-4 md:gap-6">
                 <div className="col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Sport Name</label>
                   <input
                     type="text" required
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                     className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none touch-target"
                     placeholder="e.g. Volleyball"
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Lead Coach</label>
                   <input
                     type="text" required
                     value={formData.coach}
                     onChange={e => setFormData({...formData, coach: e.target.value})}
                     className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none touch-target"
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Monthly Fee (₹)</label>
                   <input
                     type="number" required
                     value={formData.fees}
                     onChange={e => setFormData({...formData, fees: parseInt(e.target.value)})}
                     className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none touch-target"
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Max Capacity</label>
                   <input
                     type="number" required
                     value={formData.maxStudents}
                     onChange={e => setFormData({...formData, maxStudents: parseInt(e.target.value)})}
                     className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none touch-target"
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Location</label>
                   <input
                     type="text" required
                     value={formData.location}
                     onChange={e => setFormData({...formData, location: e.target.value})}
                     className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none touch-target"
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Image URL</label>
                   <input
                     type="text"
                     value={formData.image}
                     onChange={e => setFormData({...formData, image: e.target.value})}
                     className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none touch-target"
                     placeholder="/images/your-sport-image.jpg or leave blank for default"
                   />
                 </div>

                 <button type="submit" className="col-span-2 h-16 sporty-gradient text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-violet-400/20 mt-4 active:scale-95 transition-all flex items-center justify-center gap-3 touch-target">
                   <Save size={20} /> Launch Discipline
                 </button>
               </form>
             </motion.div>
           </div>
         )}
         
         {/* OCR Upload Modal */}
         {showOcrModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div style={{ background: 'rgba(124, 58, 237, 0.08)' }} className="absolute inset-0" onClick={() => setShowOcrModal(false)} />
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
             >
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xl md:text-2xl font-black text-slate-800">Upload Sport Enrollment Form</h3>
                 <button onClick={() => setShowOcrModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                   <X size={24} />
                 </button>
               </div>

               <input
                 ref={fileInputRef}
                 type="file"
                 accept=".jpg,.jpeg,.png,.pdf"
                 onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                 className="hidden"
               />

               {!ocrData && (
                 <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center">
                   <FileImage size={48} className="mx-auto text-slate-400 mb-4" />
                   <p className="text-slate-600 font-medium mb-4">Upload JPG, PNG, or PDF enrollment form</p>
                   <div className="flex justify-center gap-4">
                     <button
                       onClick={handleOcrCapture}
                       className="sporty-gradient text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                     >
                       <Upload size={20} /> Choose File
                     </button>
                   </div>
                 </div>
               )}

               {ocrLoading && (
                 <div className="text-center py-8">
                   <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                   <p className="text-slate-600 font-medium">Processing enrollment form...</p>
                 </div>
               )}

               {ocrData && (
                 <div className="space-y-4">
                   {previewUrl && (
                     <div className="border rounded-xl p-4 max-h-48 overflow-hidden">
                       <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto" />
                     </div>
                   )}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-bold text-slate-500 mb-1">Sport Name</label>
                       <input
                         type="text"
                         value={formData.name}
                         onChange={e => setFormData({...formData, name: e.target.value})}
                         className={cn(
                           "w-full h-12 bg-slate-50 border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20",
                           ocrData.sportsSelected.lowConfidence ? "border-amber-300" : "border-card-border"
                         )}
                       />
                       {ocrData.sportsSelected.lowConfidence && (
                         <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><AlertCircle size={12} /> Low confidence</p>
                       )}
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-slate-500 mb-1">Lead Coach</label>
                       <input
                         type="text"
                         value={formData.coach}
                         onChange={e => setFormData({...formData, coach: e.target.value})}
                         className={cn(
                           "w-full h-12 bg-slate-50 border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20",
                           ocrData.parentName.lowConfidence ? "border-amber-300" : "border-card-border"
                         )}
                       />
                       {ocrData.parentName.lowConfidence && (
                         <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><AlertCircle size={12} /> Low confidence</p>
                       )}
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-slate-500 mb-1">Location</label>
                       <input
                         type="text"
                         value={formData.location}
                         onChange={e => setFormData({...formData, location: e.target.value})}
                         className={cn(
                           "w-full h-12 bg-slate-50 border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20",
                           ocrData.permanentAddress.lowConfidence ? "border-amber-300" : "border-card-border"
                         )}
                       />
                       {ocrData.permanentAddress.lowConfidence && (
                         <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><AlertCircle size={12} /> Low confidence</p>
                       )}
                     </div>
                   </div>
                   <div className="flex gap-3 pt-4">
                     <button
                       onClick={() => setShowOcrModal(false)}
                       className="flex-1 h-12 bg-slate-100 text-slate-700 rounded-xl font-bold"
                     >
                       Cancel
                     </button>
                     <button
                       onClick={handleAddSport}
                       className="flex-1 h-12 sporty-gradient text-white rounded-xl font-bold"
                     >
                       Save to Database
                     </button>
                   </div>
                 </div>
               )}
             </motion.div>
           </div>
         )}
       </AnimatePresence>
     </div>
   );
 }