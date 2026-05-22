import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, MessageCircle, Trash2, X, Save } from 'lucide-react';

interface CourtBookingRequest {
  _id: string;
  bookingType: string;
  date: string;
  startTime?: string;
  endTime?: string;
  courtType: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  purpose: string;
  additionalNotes?: string;
  status: 'pending' | 'approved' | 'rejected';
  whatsappSent?: boolean;
  createdAt: string;
}

export function CourtBookingAdmin() {
  const [requests, setRequests] = useState<CourtBookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const apiBase = import.meta.env.VITE_API_BASE_URL?.trim() || '';
      const apiUrl = apiBase ? `${apiBase}/api/court-bookings` : '/api/court-bookings';
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        console.error('Failed to fetch bookings:', response.status);
        setRequests([]);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL?.trim() || '';
      const apiUrl = apiBase ? `${apiBase}/api/court-bookings/${id}` : `/api/court-bookings/${id}`;
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action === 'approve' ? 'approved' : 'rejected' })
      });

      if (!response.ok) {
        throw new Error('Failed to update booking');
      }

      const updatedBooking = await response.json();
      
      setRequests(prev => prev.map(request => 
        request._id === id ? updatedBooking : request
      ));
      setLastUpdated(new Date().toLocaleTimeString());
      
      setNotificationType('success');
      setNotificationMessage(`Booking request ${action}ed successfully!`);
      setShowNotification(true);
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      setNotificationType('error');
      setNotificationMessage(`Failed to ${action} booking request.`);
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissNotification = () => {
    setShowNotification(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-4">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-slate-600">Loading court booking requests...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Notification */}
      {showNotification && (
        <div className={`mb-6 p-4 rounded-lg border-l-4 ${notificationType === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <div className="flex items-start gap-3">
            {notificationType === 'success' ? (
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle size={20} className="flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium">{notificationMessage}</p>
            </div>
            <button 
              onClick={handleDismissNotification}
              className="ml-auto text-sm bg-transparent hover:bg-opacity-10 rounded-lg p-1"
            >
              <svg size={16} className="text-slate-400 hover:text-slate-600">
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-4">Court Booking Requests</h1>
          <p className="text-slate-600">
            Manage and respond to court booking requests from users. Click the WhatsApp icon to send approval notifications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="text-slate-500 text-sm">Last updated: {lastUpdated}</div>
          )}
          <button
            type="button"
            onClick={loadRequests}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Refresh
          </button>
        </div>
      </div>

{requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">No court booking requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const timeDisplay = request.startTime ? `${request.startTime}${request.endTime ? ` - ${request.endTime}` : ''}` : 'Not specified';
            const whatsappMessage = encodeURIComponent(
              `Hello ${request.fullName}! Your court booking request has been approved.\n\n` +
              `Details:\n` +
              `Date: ${request.date}\n` +
              `Time: ${timeDisplay}\n` +
              `Court Type: ${request.courtType}\n` +
              `Purpose: ${request.purpose}\n\n` +
              `Please arrive 15 minutes before your booking time. Thank you!`
            );
            const whatsappUrl = `https://wa.me/${request.phoneNumber.replace(/\s+/g, '')}?text=${whatsappMessage}`;
            
            return (
              <div key={request._id} className="border rounded-2xl p-6 bg-white shadow-sm">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <svg size={20} className="text-primary">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">{request.fullName}</h2>
                      <p className="text-sm text-slate-500">#{request._id.slice(-6)} • {new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>📅 {request.date}</span>
                    <span>🕐 {timeDisplay}</span>
                    <span>📋 {request.courtType}</span>
                    <span>📱 {request.phoneNumber}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Purpose</p>
                    <p className="text-slate-800">{request.purpose}</p>
                  </div>
                  {request.email && (
                    <div>
                      <p className="text-sm font-medium text-slate-600">Email</p>
                      <p className="text-slate-800">{request.email}</p>
                    </div>
                  )}
                </div>
                
                {request.additionalNotes && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-600 mb-1">Additional Notes</p>
                    <p className="text-slate-800 whitespace-pre-wrap">{request.additionalNotes}</p>
                  </div>
                )}
                
                <div className="flex justify-end gap-3">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(request._id, 'approve')}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(request._id, 'reject')}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {request.status !== 'pending' && (
                    <>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-50 hover:bg-green-100 text-green-800 border border-green-200"
                      >
                        <svg size={16} className="text-green-600">
                          <path d="M8.144 11.463a6.377 6.377 0 0 1-1.794-.418 4.11 4.11 0 0 1 .552-1.828c0-.498.1-.979.284-1.428a2.905 2.905 0 0 1 .778-1.1l.091-.063a3.01 3.01 0 0 1 .425-.566 3.354 3.354 0 0 1 1.234-.326c.731-.078 1.453.042 2.015.412a3.25 3.25 0 0 1 1.15.815c.164.121.32.251.468.389a2.464 2.464 0 0 1 .394.563l.036.087a2.545 2.545 0 0 1 .177.728c-.021.382-.133.739-.354.999a3.48 3.48 0 0 1-.516.486 3.53 3.53 0 0 1-.49.203 3.627 3.627 0 0 1-1.23.134zm1.43-3.91a4.73 4.73 0 1 0 6.688 6.688 4.72 4.72 0 0 0-6.688-6.688z"></path>
                        </svg>
                        Send WhatsApp
                      </a>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {request.status === 'approved' ? 'Approved' : 'Rejected'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}