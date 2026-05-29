const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

const sendEmail = async ({ to, subject, text, html, replyTo, attachments }) => {
  const mailer = getTransporter();

  if (!mailer) {
    console.warn("[EMAIL NOT CONFIGURED]", {
      to,
      subject,
      requiredEnv: ["EMAIL_USER", "EMAIL_PASS"],
    });
    return { sent: false, skipped: true };
  }

  try {
    const info = await mailer.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
      replyTo,
      attachments
    });
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error("[EMAIL ERROR]", error);
    throw error;
  }
};

module.exports = sendEmail;
