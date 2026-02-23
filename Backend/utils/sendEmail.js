const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  return transporter;
};

const sendEmail = async ({ to, subject, text }) => {
  const mailer = getTransporter();

  // Simple fallback for local development if SMTP is not configured.
  if (!mailer) {
    console.log("[EMAIL MOCK]", { to, subject, text });
    return;
  }

  await mailer.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
