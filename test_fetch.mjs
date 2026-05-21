#!/usr/bin/env node
// Test script: Simulate browser fetch to /api/court-bookings
// This runs in Node.js which has the same fetch implementation as the browser

const data = {
  bookingType: 'team',
  date: '2026-05-22',
  startTime: '10:00',
  endTime: '12:00',
  courtType: 'basketball',
  fullName: 'Test',
  phoneNumber: '1234567890',
  purpose: 'practice'
};

console.log('Testing fetch to /api/court-bookings...');

fetch('http://localhost:3000/api/court-bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
  redirect: 'manual'
})
  .then(async res => {
    console.log('→ response.status:', res.status);
    console.log('→ response.ok:', res.ok);
    console.log('→ response.type:', res.type);
    console.log('→ response.url:', res.url);
    const ct = res.headers.get('content-type');
    console.log('→ Content-Type:', ct);
    
    if (ct && ct.includes('application/json')) {
      return res.json().then(d => ({
        isJson: true,
        data: d,
        status: res.status
      }));
    } else {
      const text = await res.text();
      return {
        isJson: false,
        text: text.slice(0, 200),
        status: res.status
      };
    }
  })
  .then(result => {
    console.log('Result:', JSON.stringify(result, null, 2));
    if (result.isJson && result.status === 201) {
      console.log('✅ SUCCESS: Booking was created');
    } else {
      console.log('❌ FAILED: Status:', result.status, 'isJson:', result.isJson);
    }
  })
  .catch(err => {
    console.error('Fetch ERROR:', err.message, '(' + err.name + ')');
  });
