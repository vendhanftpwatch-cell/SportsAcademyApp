/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { StudentArchive } from './components/StudentModule/Students';
import { StudentFees } from './components/StudentModule/StudentFees';
import { SportsList } from './components/SportsModule/SportsList';
import { StudentAttendance } from './components/AttendanceModule/StudentAttendance';
import { Gallery } from './components/Gallery';
import { SummerCamp, UpcomingEvents } from './components/SpecialEvents/SpecialModules';
import { CoachManagement } from './components/CoachModule/CoachManagement';
import { CoachAttendance } from './components/CoachModule/CoachAttendance';
import { CoachPay } from './components/CoachModule/CoachPay';
import { Settings } from './components/Settings';
import { AdminPanel } from './components/Admin/AdminPanel';
import { WeeklySchedule } from './components/Admin/WeeklySchedule';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('auth') === 'true';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = (status: boolean) => {
    setIsAuthenticated(status);
    if (status) localStorage.setItem('auth', 'true');
    else localStorage.removeItem('auth');
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen bg-bento-bg">
        <Sidebar isAdmin={isAuthenticated} mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden safe-area-inset">
          <div className="md:hidden flex justify-between items-center mb-4 px-2">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-3 rounded-xl bg-white shadow-md border border-sky-100 min-h-[44px] min-w-[44px]"
              aria-label="Open menu"
            >
              <Menu size={24} className="text-slate-700" />
            </button>
          </div>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Dashboard isAdmin={isAuthenticated} />} />
              <Route path="/sports" element={<SportsList isAdmin={isAuthenticated} />} />
              <Route path="/summer-camp" element={<SummerCamp />} />
              <Route path="/events" element={<UpcomingEvents isAdmin={isAuthenticated} />} />
              <Route path="/attendance/students" element={<StudentAttendance isAdmin={isAuthenticated} />} />
              <Route path="/schedule" element={<WeeklySchedule isAdmin={isAuthenticated} />} />
              <Route path="/students/archive" element={<StudentArchive isAdmin={isAuthenticated} />} />
              <Route path="/students/list" element={<StudentArchive isAdmin={isAuthenticated} />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/login" element={!isAuthenticated ? <Login onLogin={() => handleLogin(true)} /> : <Navigate to="/" replace />} />
              
              {/* Admin Gateway */}
              <Route 
                path="/admin" 
                element={isAuthenticated ? <AdminPanel /> : <Navigate to="/login" replace />} 
              />
              
              {/* Protected Admin Detail Routes */}
              <Route 
                path="/attendance/coaches" 
                element={isAuthenticated ? <CoachAttendance /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/coaches" 
                element={<CoachManagement isAdmin={isAuthenticated} />} 
              />
              <Route 
                path="/coaches/pay" 
                element={isAuthenticated ? <CoachPay /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/settings" 
                element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/fees" 
                element={isAuthenticated ? <StudentFees /> : <Navigate to="/login" replace />} 
              />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

