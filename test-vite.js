// test-vite.js
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/court-bookings',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/plain, */*',
    'Origin': 'http://localhost:3000',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
};

console.log('Making POST request to /api/court-bookings...');
const req = http.request(options, (res) => {
  let data = '';
  console.log('Response status:', res.statusCode);
  console.log('Response headers:', JSON.stringify(res.headers, null, 2));
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response body:', data);
    try {
      const parsed = JSON.parse(data);
      console.log('JSON parsed OK');
    } catch(e) {
      console.log('JSON parse FAILED:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.log('REQ ERROR:', e.message);
});

req.write(JSON.stringify({
  bookingType: 'team',
  date: '2026-05-22',
  startTime: '10:00',
  endTime: '12:00',
  courtType: 'basketball',
  fullName: 'Test',
  phoneNumber: '1234567890',
  purpose: 'practice'
}));

req.end();
setTimeout(() => {
  console.log('Request timed out after 5s');
  process.exit(1);
}, 5000);
