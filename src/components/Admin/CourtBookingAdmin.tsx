import React, { useState, useEffect } from 'react';

interface CourtBookingRequest {
  id: number;
  bookingType: string;
  date: string;
  time?: string;
  fullName: string;
  phoneNumber: string;
  purpose: string;
  address: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  whatsappSent?: boolean;
}

export function CourtBookingAdmin() {
  const [requests, setRequests] = useState<CourtBookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    setLoading(true);
    try {
      const storedRequests = localStorage.getItem('courtBookingRequests');
      const parsedRequests = storedRequests ? JSON.parse(storedRequests) : [];
      setRequests(parsedRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

    const handleAction = (id: number, action: 'approve' | 'reject') => {
    setLoading(true);
    try {
      const updatedRequests = requests.map(request => {
        if (request.id === id) {
          const updatedRequest = { ...request, status: action === 'approve' ? 'approved' : 'rejected' };
          
          // If approving, prepare WhatsApp notification
          if (action === 'approve') {
            const whatsappMessage = encodeURIComponent(
              `Hello ${request.fullName}! Your court booking request has been approved.\n\n` +
              `Details:\n` +
              `Date: ${request.date}\n` +
              `Time: ${request.time || 'Not specified'}\n` +
              `Type: ${request.bookingType}\n` +
              `Purpose: ${request.purpose}\n` +
              `Address: ${request.address}\n\n` +
              `Please arrive 15 minutes before your booking time. Thank you!`
            );
            
            // Store WhatsApp URL in the request for later use
            updatedRequest.whatsappUrl = `https://wa.me/${request.phoneNumber.replace(/\s+/g, '')}?text=${whatsappMessage}`;
          }
          
          return updatedRequest;
        }
        return request;
      });
      
      localStorage.setItem('courtBookingRequests', JSON.stringify(updatedRequests));
      setRequests(updatedRequests);
      
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
              <svg size={20} className="flex-shrink-0 mt-0.5">
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            ) : (
              <svg size={20} className="flex-shrink-0 mt-0.5">
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
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

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-4">Court Booking Requests</h1>
        <p className="text-slate-600">
          Manage and respond to court booking requests from users. Click the WhatsApp icon to send approval notifications.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">No court booking requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border rounded-2xl p-6 bg-white shadow-sm">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <svg size={20} className="text-primary">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{request.fullName}</h2>
                    <p className="text-sm text-slate-500">#{request.id} • {new Date(request.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>📅 {request.date}</span>
                  <span>🕐 {request.time || 'Not specified'}</span>
                  <span>📋 {request.bookingType}</span>
                  <span>📱 {request.phoneNumber}</span>
                </div>
              </div>
              
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <div>
                   <p className="text-sm font-medium text-slate-600">Purpose</p>
                   <p className="text-slate-800">{request.purpose}</p>
                 </div>
                 <div>
                   <p className="text-sm font-medium text-slate-600">Address</p>
                   <p className="text-slate-800">{request.address}</p>
                 </div>
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
                      onClick={() => handleAction(request.id, 'approve')}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(request.id, 'reject')}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Reject
                    </button>
                  </>
                )}
                
                {request.status !== 'pending' && (
                  <>
                    {request.whatsappUrl && (
                      <a
                        href={request.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-50 hover:bg-green-100 text-green-800 border border-green-200"
                      >
                        <svg size={16} className="text-green-600">
                          <path d="M8.144 11.463a6.377 6.377 0 0 1-1.794-.418 4.11 4.11 0 0 1 .552-1.828c0-.498.1-.979.284-1.428a2.905 2.905 0 0 1 .778-1.1l.091-.063a3.01 3.01 0 0 1 .425-.566 3.354 3.354 0 0 1 1.234-.326c.731-.078 1.453.042 2.015.412a3.25 3.25 0 0 1 1.15.815c.164.121.32.251.468.389a2.464 2.464 0 0 1 .394.563l.036.087a2.545 2.545 0 0 1 .177.728c-.021.382-.133.739-.354.999a3.48 3.48 0 0 1-.516.486 3.53 3.53 0 0 1-.49.203 3.627 3.627 0 0 1-1.23.134zm1.43-3.91a4.73 4.73 0 1 0 6.688 6.688 4.72 4.72 0 0 0-6.688-6.688z"></path>
                        </svg>
                        Send WhatsApp
                      </a>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {request.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}