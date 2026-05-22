import React, { useState } from 'react';
import { motion } from 'motion/react';

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
      <div className="border border-card-border rounded-2xl p-5 md:p-6 bg-white shadow-sm">
        <h2 className="text-2xl font-bold text-primary mb-3 md:mb-4">Court Room Booking</h2>
        <p className="text-slate-500 mb-4 text-sm md:text-base">
          Fill out the form below to book a court room. Our admin team will review your request and
          confirm your booking via WhatsApp if approved.
        </p>

        {submitStatus === 'success' && (
          <div className="bg-emerald-50 border border-emerald-200 text-success px-4 py-3.5 rounded-2xl mb-4 text-sm font-semibold">Booking request submitted successfully! Our admin team will review your request and confirm via WhatsApp if approved.</div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-rose-50 border border-rose-200 text-danger px-4 py-3.5 rounded-2xl mb-4 text-sm font-semibold">Failed to submit booking request. Please try again.</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Booking Type</label>
            <input
              type="text"
              name="bookingType"
              value={formData.bookingType}
              onChange={handleChange}
              required
              placeholder="e.g. Personal, Team, Event"
              className="w-full px-4 py-3 border border-card-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-slate-700 bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-card-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-slate-700 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-card-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-slate-700 bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-card-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-slate-700 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Court Type</label>
              <select
                name="courtType"
                value={formData.courtType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-card-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-slate-700 bg-slate-50"
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
            <label className="block text-sm font-semibold text-slate-600 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-card-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-slate-700 bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-card-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-slate-700 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-card-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-slate-700 bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Purpose of Booking</label>
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-card-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-slate-700 bg-slate-50"
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
            <label className="block text-sm font-semibold text-slate-600 mb-2">Additional Notes</label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-card-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-semibold text-slate-700 bg-slate-50"
              placeholder="Any special requirements or additional information..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sporty-gradient text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-target"
          >
            {isSubmitting ? (
              <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span className="text-lg leading-none">⭐</span>
                <span>Submit Booking Request</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
