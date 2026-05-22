import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, MessageCircle, Trash2, X } from 'lucide-react';

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
  amount?: number;
  paymentStatus?: string;
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
      const apiBase = import.meta.env.VITE_API_BASE_URL?.trim() || window.location.origin;
      const apiUrl = `${apiBase}/api/court-bookings`;
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
      const apiBase = import.meta.env.VITE_API_BASE_URL?.trim() || window.location.origin;
      const apiUrl = `${apiBase}/api/court-bookings/${id}`;
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action === 'approve' ? 'approved' : 'rejected' }),
      });
      if (!response.ok) {
        throw new Error('Failed to update booking');
      }
      const updatedBooking = await response.json();
      setRequests(prev => prev.map(request => (request._id === id ? updatedBooking : request)));
      setLastUpdated(new Date().toLocaleTimeString());
      setNotificationType('success');
      setNotificationMessage(`Booking request ${action}d successfully!`);
      setShowNotification(true);
    } catch (err) {
      console.error(`Error ${action}ing request:`, err);
      setNotificationType('error');
      setNotificationMessage(`Failed to ${action} the booking request.`);
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };

  const dismissNotification = () => setShowNotification(false);

  if (loading && requests.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-8 h-8 border-2 border-violet-200 border-t-primary rounded-full"
            />
            <span className="text-slate-500 font-medium">Loading court booking requests...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-2xl border border-l-4 ${
            notificationType === 'success'
              ? 'bg-emerald-50 border-success text-success'
              : 'bg-rose-50 border-danger text-danger'
          }`}
        >
          <div className="flex items-start gap-3">
            {notificationType === 'success' ? (
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle size={20} className="flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{notificationMessage}</p>
            </div>
            <button onClick={dismissNotification} className="ml-auto p-1 rounded-lg hover:bg-black/5 transition-colors">
              <X size={16} className="text-slate-400" />
            </button>
          </div>
        </motion.div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">Court Booking Requests</h1>
          <p className="text-slate-500 text-sm md:text-base">
            Manage and respond to court booking requests from users. Click WhatsApp to send approval notifications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && <div className="text-slate-400 text-sm font-semibold">Last updated: {lastUpdated}</div>}
          <button
            type="button"
            onClick={loadRequests}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-50 border border-violet-100 text-primary hover:bg-violet-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-14 bg-white rounded-2xl border border-card-border shadow-sm">
          <p className="text-slate-400 font-medium">No court booking requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const timeDisplay = request.startTime
              ? `${request.startTime}${request.endTime ? ` - ${request.endTime}` : ''}`
              : 'Not specified';
            const whatsappMessage = encodeURIComponent(
              `Hello ${request.fullName}! Your court booking request has been approved.\n\nDetails:\nDate: ${request.date}\nTime: ${timeDisplay}\nCourt Type: ${request.courtType}\nPurpose: ${request.purpose}\n\nPlease arrive 15 minutes before your booking time. Thank you!`
            );
            const whatsappUrl = `https://wa.me/${request.phoneNumber.replace(/\s+/g, '')}?text=${whatsappMessage}`;

            return (
              <div
                key={request._id}
                className="border border-card-border rounded-2xl p-5 md:p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-primary">
                      <svg width={20} className="text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-slate-800">{request.fullName}</h2>
                      <p className="text-sm text-slate-400 font-medium">
                        #{request._id.slice(-6)} &middot; {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4 text-sm text-slate-500 font-medium flex-wrap">
                    <span>&#128197; {request.date}</span>
                    <span>&#9200; {timeDisplay}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-50 text-primary border border-violet-100">{request.courtType}</span>
                    {request.amount != null && request.amount > 0 && (
                      <span className="font-bold text-primary">&#x20B9; {request.amount.toLocaleString('en-IN')}</span>
                    )}
                    {request.paymentStatus && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        request.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-success border border-emerald-100'
                          : request.paymentStatus === 'initiated'
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {request.paymentStatus}
                      </span>
                    )}
                    <span>&#128241; {request.phoneNumber}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Purpose</p>
                    <p className="text-slate-800 font-medium">{request.purpose}</p>
                  </div>
                  {request.email && (
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Email</p>
                      <p className="text-slate-800 font-medium">{request.email}</p>
                    </div>
                  )}
                </div>

                {request.additionalNotes && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-500 mb-1">Additional Notes</p>
                    <p className="text-slate-600 whitespace-pre-wrap text-sm">{request.additionalNotes}</p>
                  </div>
                )}

                <div className="flex flex-wrap justify-end gap-3">
                  {request.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleAction(request._id, 'approve')}
                        disabled={loading}
                        className="px-5 py-2 bg-success text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(request._id, 'reject')}
                        disabled={loading}
                        className="px-5 py-2 bg-danger text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-emerald-50 hover:bg-emerald-100 text-success border border-emerald-100 transition-colors"
                      >
                        <MessageCircle size={15} className="text-emerald-600" />
                        Send WhatsApp
                      </a>
                      <span
                        className={`px-3 py-2 rounded-full text-sm font-semibold ${
                          request.status === 'approved'
                            ? 'bg-emerald-50 text-success border border-emerald-100'
                            : 'bg-rose-50 text-danger border border-rose-100'
                        }`}
                      >
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
