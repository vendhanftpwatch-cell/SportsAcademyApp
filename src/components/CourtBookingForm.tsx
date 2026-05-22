import React, { useState, useEffect } from 'react';

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function formatDuration(hoursDecimal: number): string {
  const totalMin = Math.round(hoursDecimal * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

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
    amount: 0,
  });

  // ---- Price calculation: ₹100 / hour ----
  const calculatePrice = (startTimeStr: string, endTimeStr: string): number => {
    if (!startTimeStr || !endTimeStr) return 0;

    const startP = startTimeStr.split(':');
    const endP = endTimeStr.split(':');
    if (startP.length !== 2 || endP.length !== 2) return 0;

    const sh = parseInt(startP[0], 10);
    const sm = parseInt(startP[1], 10);
    const eh = parseInt(endP[0], 10);
    const em = parseInt(endP[1], 10);
    if ([sh, sm, eh, em].some(Number.isNaN)) return 0;

    let diff = eh * 60 + em - (sh * 60 + sm);
    if (diff < 0) diff += 24 * 60; // overnight

    const hours = diff / 60;
    return Math.round(hours * 100); // ₹100 per hour
  };

  // ---- Keep price in sync with time inputs ----
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      setFormData(prev => ({ ...prev, amount: calculatePrice(prev.startTime, prev.endTime) }));
    }
  }, [formData.startTime, formData.endTime]);

  // ---- Paylink payment flow state ----
  const [isPaying, setIsPaying] = useState(false);
  const [paylinkError, setPaylinkError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Validate end time so it's after start time
    if (name === 'endTime' && formData.startTime && value) {
      if (value <= formData.startTime) {
        setPaylinkError(null);
      }
    }

    // Guard: if start time is set and end becomes <= start, recalculate as 0
    if (name === 'startTime' && formData.endTime && value) {
      if (formData.endTime <= value) {
        // end time will be invalidated on blur or next endTime change
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    setPaylinkError(null);
  };

  // ---- Build a real booking record before opening the payment link ----
  const handleProceedToPay = async () => {
    setPaylinkError(null);

    if (!formData.startTime || !formData.endTime) {
      setPaylinkError('Please select both start and end time.');
      return;
    }
    if (formData.endTime <= formData.startTime) {
      setPaylinkError('End time must be after start time.');
      return;
    }
    if (formData.amount <= 0) {
      setPaylinkError('Calculated amount is zero. Please check your time selection.');
      return;
    }
    if (!formData.fullName.trim()) {
      setPaylinkError('Please enter your full name.');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setPaylinkError('Please enter your phone number.');
      return;
    }

    // ---- Step 1: Save booking record in DB ----
    setIsPaying(true);
    try {
      const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || window.location.origin;
      const saveUrl = `${apiBase}/api/court-bookings`;

      const bookingPayload = {
        bookingType: formData.bookingType,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        courtType: formData.courtType,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        purpose: formData.purpose,
        additionalNotes: formData.additionalNotes,
        amount: formData.amount,
        paymentStatus: 'pending',
        status: 'pending',
      };

      const saveRes = await fetch(saveUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      if (!saveRes.ok) {
        const errBody = await saveRes.json().catch(() => ({}));
        console.error('[Booking save error]', errBody);
        setPaylinkError(errBody.error || 'Failed to save booking. Please try again.');
        setIsPaying(false);
        return;
      }

      const savedBooking = await saveRes.json();
      console.log('[Booking saved]', savedBooking);

      // ---- Step 2: Ask server to create a Paylink payment link ----
      const payLinkUrl = `${apiBase}/api/create-payment-link`;
      const payResponse = await fetch(payLinkUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: savedBooking._id || savedBooking.id,
          amount: formData.amount,
          customerName: formData.fullName,
          customerPhone: formData.phoneNumber,
          customerEmail: formData.email,
          description: `Sports Academy Court Booking${formData.courtType ? ` – ${formData.courtType}` : ''}`,
        }),
      });

      if (!payResponse.ok) {
        const errBody = await payResponse.json().catch(() => ({}));
        console.error('[Paylink create error]', errBody);
        setPaylinkError(errBody.error || 'Failed to create payment link. Please try again.');
        setIsPaying(false);
        return;
      }

      const paylinkData = await payResponse.json();
      console.log('[Paylink response]', paylinkData);

      if (paylinkData.success && paylinkData.paylinkUrl) {
        // ---- Step 3: Handle different provider types ----
        if (paylinkData.provider === 'direct-upi') {
          // Direct UPI - try to open UPI app directly (works on mobile)
          const upiLink = paylinkData.paylinkUrl;
          
          // Try to open UPI app - on mobile this will open the app with pre-filled amount
          // On desktop, this will show a blank page (browser limitation)
          window.location.href = upiLink;
        } else {
          // PhonePe/GooglePay - open checkout page in popup window
          const w = 520;
          const h = 640;
          const screenX = typeof window.screenX !== 'undefined' ? window.screenX : window.screenLeft;
          const screenY = typeof window.screenY !== 'undefined' ? window.screenY : window.screenTop;
          const outerW = typeof window.outerWidth !== 'undefined' ? window.outerWidth : (document as any).documentElement?.clientWidth || window.innerWidth || 1024;
          const outerH = typeof window.outerHeight !== 'undefined' ? window.outerHeight : (document as any).documentElement?.clientHeight || window.innerHeight || 768;
          const left = Math.max(0, screenX + (outerW - w) / 2);
          const top  = Math.max(0, screenY + (outerH - h) / 2);

          const popup = window.open(
            paylinkData.paylinkUrl,
            'PaylinkCheckout',
            `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no`
          );

          if (popup) {
            // When the popup is closed (PIN flow completed / cancelled), refresh status
            const pollClose = setInterval(() => {
              if (popup.closed) {
                clearInterval(pollClose);
                setIsPaying(false);
                // Poll server for booking status update; for now we just reset button
                window.location.reload();
              }
            }, 1000);
          }
        }
      } else {
        setPaylinkError('Payment link was not returned. Please check your Paylink credentials and try again.');
      }
    } catch (err) {
      console.error('[Payment flow error]', err);
      setPaylinkError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsPaying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Normal form submit — just save booking + trigger payment
    await handleProceedToPay();
  };

  const minutesDisplay = formData.startTime && formData.endTime
    ? (() => {
        const s = formData.startTime.split(':');
        const e = formData.endTime.split(':');
        let diff = parseInt(e[0]) * 60 + parseInt(e[1]) - (parseInt(s[0]) * 60 + parseInt(s[1]));
        if (diff < 0) diff += 24 * 60;
        return formatDuration(diff / 60);
      })()
    : '—';

  const canPay = formData.startTime && formData.endTime && formData.amount > 0;

  return (
    <div className="space-y-6">
      <div className="border border-card-border rounded-2xl p-5 md:p-6 bg-white shadow-sm">
        <h2 className="text-2xl font-bold text-primary mb-3 md:mb-4">Court Room Booking</h2>
        <p className="text-slate-500 mb-4 text-sm md:text-base">
          Select your time slot — the amount is calculated instantly. Enter your PIN to complete payment.
        </p>

        {/* Paylink error banner */}
        {paylinkError && (
          <div className="bg-rose-50 border border-rose-200 text-danger px-4 py-3.5 rounded-2xl mb-4 text-sm font-semibold">
            {paylinkError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ── Booking Type ── */}
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

          {/* ── Date + Start Time ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
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

          {/* ── End Time + Court Name ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                min={formData.startTime || undefined}
                className="w-full px-4 py-3 border border-card-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-slate-700 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Court Name</label>
              <select
                name="courtType"
                value={formData.courtType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-card-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-slate-700 bg-slate-50"
              >
                <option value="">Select court name</option>
                <option value="cheran">Cheran Court</option>
                <option value="pandian">Pandian Court</option>
              </select>
            </div>
          </div>

          {/* ── Full Name ── */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-card-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-slate-700 bg-slate-50"
            />
          </div>

          {/* ── Phone + Email ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="10-digit mobile number"
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
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-card-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-slate-700 bg-slate-50"
              />
            </div>
          </div>

          {/* ── Purpose ── */}
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

          {/* ── Additional Notes ── */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Additional Notes</label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows={3}
              placeholder="Any special requirements or additional information…"
              className="w-full px-4 py-3 border border-card-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-semibold text-slate-700 bg-slate-50"
            />
          </div>

          {/* ── Price Summary Card ── */}
          <div className="bg-gradient-to-r from-primary/8 to-accent/10 border border-primary/20 rounded-xl p-5 mt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-600">Duration</span>
              <span className="text-sm font-semibold text-slate-700">{minutesDisplay}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-slate-500">Rate</span>
              <span className="text-sm text-slate-500">₹100 / hour</span>
            </div>
            <div className="h-px bg-slate-200 mb-3" />
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-slate-800">Total Amount</span>
              <span className={`text-3xl font-extrabold ${formData.amount > 0 ? 'text-primary' : 'text-slate-400'}`}>
                {formData.amount > 0 ? formatCurrency(formData.amount) : formatCurrency(0)}
              </span>
            </div>
          </div>

          {/* ── Proceed to Pay Button (opens Paylink PIN flow) ── */}
          <button
            type="button"
            onClick={handleProceedToPay}
            disabled={isPaying || !canPay}
            className="w-full bg-gradient-to-r from-primary to-[#D4831A] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-target shadow-lg shadow-primary/25"
          >
            {isPaying ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Opening Paylink…</span>
              </>
            ) : (
              <>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                <span>Proceed to Pay — {formData.amount > 0 ? formatCurrency(formData.amount) : 'Enter times to see amount'}</span>
              </>
            )}
          </button>

          {!canPay && !paylinkError && (
            <p className="text-center text-xs text-slate-400">
              Select start and end time to see your total.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
