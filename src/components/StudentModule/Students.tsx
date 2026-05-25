import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Filter, Edit2, Trash2, User, Upload, Camera, FileImage, X } from 'lucide-react';
import { processImageOcr, type OcrStudentData } from '@/src/services/ocrService';

interface StudentArchiveProps {
  isAdmin?: boolean;
}

export function StudentArchive({ isAdmin = false }: StudentArchiveProps) {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrData, setOcrData] = useState<OcrStudentData | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    address: '',
    sportsSelected: '',
    dateOfBirth: '',
    dateEnrolled: '',
    parentName: ''
  });
  const [addressHistory, setAddressHistory] = useState<string[]>([]);

  const fetchData = () => {
    setLoading(true);
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        const studentArray = Array.isArray(data) ? data : [];
        setStudents(studentArray);
        // Update address history with unique addresses from fetched students
        const addresses = [...new Set(studentArray
          .map(student => student.address)
          .filter(address => address && address.trim() !== ''))];
        setAddressHistory(addresses);
      })
      .catch(error => {
        console.error('Failed to fetch students:', error);
        setStudents([]);
        setAddressHistory([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Refetch data when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
      setFormData({
        name: result.studentName.value || '',
        gender: result.gender.value || '',
        address: result.permanentAddress.value || '',
        sportsSelected: result.sportsSelected.value || '',
        dateOfBirth: result.dateOfBirth.value || '',
        dateEnrolled: result.dateEnrolled.value || '',
        parentName: result.parentName.value || ''
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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
    } catch (err) {
      console.error('Camera access denied:', err);
      alert('Camera access denied. Please use file upload instead.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], 'capture.png', { type: 'image/png' });
          handleFileUpload(file);
          stopCamera();
        }
      });
    }
  };

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          gender: formData.gender,
          address: formData.address,
          sportsJoined: formData.sportsSelected ? formData.sportsSelected.split(',').map((s: string) => s.trim()) : [],
          parentName: formData.parentName,
          dateOfBirth: formData.dateOfBirth || undefined,
          dateEnrolled: formData.dateEnrolled || undefined
        })
      });
      if (res.ok) {
        setShowAddModal(false);
        setOcrData(null);
        setPreviewUrl(null);
        setFormData({
          name: '',
          gender: '',
          address: '',
          sportsSelected: '',
          dateOfBirth: '',
          dateEnrolled: '',
          parentName: ''
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

  const filteredStudents = students.filter((student: any) =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.gender?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      gender: student.gender,
      address: student.address,
      sportsSelected: student.sportsSelected ? student.sportsSelected.join(', ') : '',
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
      dateEnrolled: student.dateEnrolled ? student.dateEnrolled.split('T')[0] : '',
      parentName: student.parentName
    });
    setShowEditModal(true);
  };

  const handleEditStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/students/${editingStudent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          gender: formData.gender,
          address: formData.address,
          sportsJoined: formData.sportsSelected ? formData.sportsSelected.split(',').map((s: string) => s.trim()) : [],
          parentName: formData.parentName,
          dateOfBirth: formData.dateOfBirth || undefined,
          dateEnrolled: formData.dateEnrolled || undefined
        })
      });
      if (res.ok) {
        setShowEditModal(false);
        setEditingStudent(null);
        // Reset formData
        setFormData({
          name: '',
          gender: '',
          address: '',
          sportsSelected: '',
          dateOfBirth: '',
          dateEnrolled: '',
          parentName: ''
        });
        fetchData();
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to update student:", errorData);
        alert(`Failed to update student: ${errorData.error || 'Unknown error'}${errorData.detail ? ' - ' + errorData.detail : ''}`);
      }
    } catch (error) {
      console.error("Failed to update student:", error);
      alert("Failed to update student: Network error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800">{isAdmin ? 'Student Archive' : 'Current Student List'}</h2>
          <p className="text-slate-500 font-medium">Manage and view all student records</p>
        </div>
        {isAdmin && (
          <>
            <button
              onClick={() => setShowOcrModal(true)}
              className="bg-white text-primary border border-primary px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <Upload size={20} /> Upload Enrollment Form
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="sporty-gradient text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-violet-400/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <Plus size={20} /> Add New Student
            </button>
          </>
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
                    <button className="p-2 text-slate-300 hover:text-primary hover:bg-violet-50 rounded-lg transition-all"
                            onClick={() => openEditModal(student)}>
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
              <input
                type="text" placeholder="Full Name" required
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
              />
              <input
                type="date" placeholder="Date of Birth" required
                value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
              />
              <input
                type="date" placeholder="Joined Date" required
                value={formData.dateEnrolled} onChange={e => setFormData({...formData, dateEnrolled: e.target.value})}
                className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
              />
              <select
                value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
                className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <select
                value={formData.sportsSelected} onChange={e => setFormData({...formData, sportsSelected: e.target.value})}
                className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                required
              >
                <option value="">Select Sport</option>
                <option value="Skating">Skating</option>
                <option value="Karate">Karate</option>
                <option value="Shuttle">Shuttle</option>
                <option value="Boxing">Boxing</option>
                <option value="Yoga">Yoga</option>
                <option value="Chess">Chess</option>
                <option value="Silambam">Silambam</option>
                <option value="Aerobics">Aerobics</option>
                <option value="Carrom">Carrom</option>
              </select>
               <input
                 type="text" placeholder="Parent's Name" required
                 value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})}
                 className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
               />
               <input
                 type="text" placeholder="Address" required
                 value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                 list="address-history"
                 className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
               />
               <datalist id="address-history">
                 {addressHistory.map((address, index) => (
                   <option key={index} value={address} />
                 ))}
               </datalist>
               <button type="submit" className="w-full h-14 sporty-gradient text-white rounded-2xl font-black uppercase tracking-widest mt-4 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                 Confirm Registration
               </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* OCR Upload Modal */}
      {showOcrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div style={{ background: 'rgba(124, 58, 237, 0.08)' }} className="absolute inset-0" onClick={() => { setShowOcrModal(false); stopCamera(); }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl font-black text-slate-800">Upload Enrollment Form</h3>
              <button onClick={() => { setShowOcrModal(false); stopCamera(); }} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
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

            {!ocrData && !cameraStream && (
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
                  <button
                    onClick={startCamera}
                    className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                  >
                    <Camera size={20} /> Use Camera
                  </button>
                </div>
              </div>
            )}

            {cameraStream && (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-h-80 object-cover rounded-xl"
                  onLoadedMetadata={() => {
                    if (videoRef.current) videoRef.current.srcObject = cameraStream;
                  }}
                />
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={stopCamera}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="sporty-gradient text-white px-6 py-2 rounded-xl font-bold"
                  >
                    Capture
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
                     <label className="block text-sm font-bold text-slate-500 mb-1">Student Name</label>
                     <input
                       type="text"
                       value={ocrData.studentName.value || ''}
                       readOnly
                       className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-500 mb-1">Sports Selected</label>
                     <input
                       type="text"
                       value={ocrData.sportsSelected.value || ''}
                       readOnly
                       className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-500 mb-1">Date of Birth</label>
                     <input
                       type="text"
                       value={ocrData.dateOfBirth.value || ''}
                       readOnly
                       className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-500 mb-1">Gender</label>
                     <input
                       type="text"
                       value={ocrData.gender.value || ''}
                       readOnly
                       className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-500 mb-1">Parent's Name</label>
                     <input
                       type="text"
                       value={ocrData.parentName.value || ''}
                       readOnly
                       className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-500 mb-1">Contact Number</label>
                     <input
                       type="text"
                       value={ocrData.contactNumber.value || ''}
                       readOnly
                       className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-500 mb-1">Permanent Address</label>
                     <input
                       type="text"
                       value={ocrData.permanentAddress.value || ''}
                       readOnly
                       className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-500 mb-1">Date Enrolled</label>
                     <input
                       type="text"
                       value={ocrData.dateEnrolled.value || ''}
                       readOnly
                       className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold text-slate-800"
                     />
                   </div>
                 </div>
                 <div className="flex gap-4 justify-end mt-6">
                   <button
                     className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold"
                     onClick={() => { setShowOcrModal(false); stopCamera(); }}
                   >
                     Cancel
                   </button>
                   <button
                     className="sporty-gradient text-white px-6 py-3 rounded-xl font-bold"
                     onClick={() => {
                       setFormData({
                         name: ocrData.studentName.value || '',
                         gender: ocrData.gender.value || '',
                         address: ocrData.permanentAddress.value || '',
                         sportsSelected: ocrData.sportsSelected.value || '',
                         dateOfBirth: ocrData.dateOfBirth.value || '',
                         dateEnrolled: ocrData.dateEnrolled.value || '',
                         parentName: ocrData.parentName.value || ''
                       });
                       setShowOcrModal(false);
                       setShowAddModal(true);
                     }}
                   >
                     Save to Database
                   </button>
                 </div>
               </div>
             )}
           </motion.div>
         </div>
       )}

       {/* Edit Modal */}
       {showEditModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div style={{ background: 'rgba(124, 58, 237, 0.08)' }} className="absolute inset-0" onClick={() => setShowEditModal(false)} />
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 md:p-8"
           >
             <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-5 md:mb-6">Edit Student</h3>
             <form onSubmit={handleEditStudent} className="space-y-4">
               <input
                 type="text" placeholder="Full Name" required
                 value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                 className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
               />
               <input
                 type="date" placeholder="Date of Birth" required
                 value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                 className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
               />
               <input
                 type="date" placeholder="Joined Date" required
                 value={formData.dateEnrolled} onChange={e => setFormData({...formData, dateEnrolled: e.target.value})}
                 className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
               />
               <select
                 value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
                 className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                 required
               >
                 <option value="">Select Gender</option>
                 <option value="Male">Male</option>
                 <option value="Female">Female</option>
                 <option value="Other">Other</option>
               </select>
               <select
                 value={formData.sportsSelected} onChange={e => setFormData({...formData, sportsSelected: e.target.value})}
                 className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                 required
               >
                 <option value="">Select Sport</option>
                 <option value="Skating">Skating</option>
                 <option value="Karate">Karate</option>
                 <option value="Shuttle">Shuttle</option>
                 <option value="Boxing">Boxing</option>
                 <option value="Yoga">Yoga</option>
                 <option value="Chess">Chess</option>
                 <option value="Silambam">Silambam</option>
                 <option value="Aerobics">Aerobics</option>
                 <option value="Carrom">Carrom</option>
               </select>
               <input
                 type="text" placeholder="Parent's Name" required
                 value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})}
                 className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
               />
               <input
                 type="text" placeholder="Address" required
                 value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                 list="address-history-edit"
                 className="w-full h-12 bg-slate-50 border border-card-border rounded-xl px-4 font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
               />
               <datalist id="address-history-edit">
                 {addressHistory.map((address, index) => (
                   <option key={index} value={address} />
                 ))}
               </datalist>
               <button type="submit" className="w-full h-14 sporty-gradient text-white rounded-2xl font-black uppercase tracking-widest mt-4 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                 Update Student
               </button>
             </form>
           </motion.div>
         </div>
       )}
     </div>
   );
 }