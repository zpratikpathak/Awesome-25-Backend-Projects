const nodemailer = require('nodemailer');

/**
 * Send email using nodemailer
 * @param {Object} options - Email options
 * @returns {Promise<void>}
 */
const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Define mail options
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'Authentication System'} <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // Add HTML version if provided
  if (options.html) {
    mailOptions.html = options.html;
  }

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;