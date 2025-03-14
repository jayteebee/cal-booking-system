// shared/emailNotifications.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,           // e.g., smtp.office365.com
  port: process.env.EMAIL_PORT,           // e.g., 587
  secure: false,                          // false for port 587 (STARTTLS will be used)
  auth: {
    user: process.env.EMAIL_USERNAME,     // your Outlook email address
    pass: process.env.EMAIL_PASSWORD,     // your Outlook password or app password
  },
  tls: {
    // This setting is often necessary to avoid certificate validation issues
    rejectUnauthorized: false
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
    from: process.env.EMAIL_USERNAME,
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
