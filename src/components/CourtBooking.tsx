import React from 'react';
import { CourtBookingForm } from './CourtBookingForm';

export function CourtBooking({ isAdmin }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] pb-8">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <CourtBookingForm />
      </div>
    </div>
  );
}