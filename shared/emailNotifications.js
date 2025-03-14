// shared/emailNotifications.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Retrieve email service credentials from environment variables.
const emailService = process.env.EMAIL_SERVICE;
const emailUsername = process.env.EMAIL_USERNAME;
const emailPassword = process.env.EMAIL_PASSWORD;

// Create a transporter using your email service credentials.
const transporter = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: emailUsername,
    pass: emailPassword
  }
});

/**
 * Sends an email notification based on a template.
 * @param {string} templateType - One of: "bookingConfirmation", "cancellation", "rearrangement"
 * @param {string} recipientEmail - The recipient's email address.
 * @param {object} data - Data to populate the email template.
 * @returns {Promise<object>} - The result of the email sending operation.
 */
async function sendEmail(templateType, recipientEmail, data) {
  let subject = '';
  let htmlContent = '';

  switch (templateType) {
    case 'bookingConfirmation':
      subject = 'Booking Confirmation';
      htmlContent = `<p>Your booking for ${data.date} has been confirmed.</p>
                     <p>Details: ${JSON.stringify(data)}</p>`;
      break;
    case 'cancellation':
      subject = 'Booking Cancellation';
      htmlContent = `<p>Your booking has been cancelled.</p>
                     <p>Alternative dates: ${data.alternativeDates ? data.alternativeDates.join(', ') : 'N/A'}</p>`;
      break;
    case 'rearrangement':
      subject = 'Booking Rearrangement';
      htmlContent = `<p>Your booking has been rearranged to ${data.newDate} for ${data.newDuration}.</p>`;
      break;
    default:
      subject = 'Notification';
      htmlContent = '<p>No template available.</p>';
  }

  const mailOptions = {
    from: emailUsername,
    to: recipientEmail,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true, info };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

module.exports = { sendEmail };
