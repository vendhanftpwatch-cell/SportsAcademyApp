import React, { useState } from 'react';

export function CourtBookingForm() {
  const [formData, setFormData] = useState({
    bookingType: '',
    date: '',
    startTime: '',
    endTime: '',
    courtType: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    purpose: '',
    additionalNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL?.trim() || window.location.origin;
      const apiUrl = `${apiBase}/api/court-bookings`;
      const postData = { ...formData };
      console.log('[SUBMIT] apiBase:', apiBase, 'url:', apiUrl);
      console.log('[SUBMIT] body:', postData);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      console.log('[SUBMIT] response status:', response.status, 'ok:', response.ok);
      console.log('[SUBMIT] response headers:', response.headers.get('content-type'));

      if (response.ok) {
        console.log('[SUBMIT] success - calling .json() ...');
        const data = await response.json();
        console.log('[SUBMIT] parsed data:', data);
        setSubmitStatus('success');
        setFormData({
          bookingType: '',
          date: '',
          startTime: '',
          endTime: '',
          courtType: '',
          fullName: '',
          phoneNumber: '',
          email: '',
          purpose: '',
          additionalNotes: '',
        });
      } else {
        console.log('[SUBMIT] response not ok, status:', response.status);
        console.log('[SUBMIT] trying to read error body...');
        try {
          const errorBody = await response.json();
          console.log('[SUBMIT] error body:', errorBody);
        } catch (e) {
          console.log('[SUBMIT] failed to parse error JSON');
          const text = await response.text();
          console.log('[SUBMIT] error text:', text?.slice(0, 200));
        }
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('[SUBMIT] throw error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-2xl p-6 bg-white shadow-sm">
        <h2 className="text-2xl font-bold text-primary mb-4">Court Room Booking</h2>
        <p className="text-slate-600 mb-4">
          Fill out the form below to book a court room. Our admin team will review your request and 
          confirm your booking via WhatsApp if approved.
        </p>
        
        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
            Booking request submitted successfully! Our admin team will review your request and confirm via WhatsApp if approved.
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            Failed to submit booking request. Please try again.
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Booking Type</label>
            <input
              type="text"
              name="bookingType"
              value={formData.bookingType}
              onChange={handleChange}
              required
              placeholder="e.g. Personal, Team, Event"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Court Type</label>
              <select
                name="courtType"
                value={formData.courtType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              >
                <option value="">Select court type</option>
                <option value="basketball">Basketball Court</option>
                <option value="tennis">Tennis Court</option>
                <option value="badminton">Badminton Court</option>
                <option value="volleyball">Volleyball Court</option>
                <option value="multi-purpose">Multi-purpose Court</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Purpose of Booking</label>
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="">Select purpose</option>
              <option value="practice">Team Practice</option>
              <option value="match">Friendly Match</option>
              <option value="tournament">Tournament</option>
              <option value="training">Individual Training</option>
              <option value="event">Social Event</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
              placeholder="Any special requirements or additional information..."
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-target"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <svg size={20} className="text-white">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <span>Submit Booking Request</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}