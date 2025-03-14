// shared/testEmailNotifications.js
const { sendEmail } = require('./emailNotifications');

async function runTest() {
  const result = await sendEmail('bookingConfirmation', 'recipient@example.com', {
    date: '2025-04-20',
    details: 'Test booking details'
  });
  console.log(result);
}

runTest();
