exports.userAutoReplyTemplate = (name, ticketId, subject) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #334155; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
  .header { background: #2563eb; color: #ffffff; padding: 20px; text-align: center; }
  .header h1 { margin: 0; font-size: 24px; }
  .content { padding: 30px; line-height: 1.6; }
  .ticket-box { background: #f1f5f9; padding: 15px; border-radius: 6px; margin: 20px 0; font-weight: bold; text-align: center; color: #0f172a; border: 1px dashed #cbd5e1; }
  .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>We Received Your Message</h1>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>Thank you for reaching out to RMS Support. We've received your message regarding "<strong>${subject}</strong>".</p>
      <p>Your ticket has been created and assigned the following ID:</p>
      <div class="ticket-box">Ticket ID: ${ticketId}</div>
      <p>Our support team will review your request and get back to you shortly. You can reply directly to this email to add more information.</p>
      <p>Best regards,<br>RMS Support Team</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Recruitment Management System. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

exports.adminNotificationTemplate = (ticketId, name, email, category, priority, subject, message, attachments) => {
  const attachmentsHtml = attachments && attachments.length > 0 
    ? `<p><strong>Attachments:</strong> ${attachments.length} file(s) attached.</p>` 
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #334155; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
  .header { background: #0f172a; color: #ffffff; padding: 20px; text-align: center; }
  .header h1 { margin: 0; font-size: 20px; }
  .content { padding: 30px; line-height: 1.6; }
  .details-box { background: #f1f5f9; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
  .details-box p { margin: 5px 0; }
  .priority-high { color: #dc2626; font-weight: bold; }
  .priority-medium { color: #d97706; font-weight: bold; }
  .priority-low { color: #16a34a; font-weight: bold; }
  .message-box { background: #ffffff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; white-space: pre-wrap; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Support Ticket: ${ticketId}</h1>
    </div>
    <div class="content">
      <div class="details-box">
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Priority:</strong> <span class="priority-${priority.toLowerCase()}">${priority}</span></p>
        ${attachmentsHtml}
      </div>
      <p><strong>Message:</strong></p>
      <div class="message-box">${message}</div>
    </div>
  </div>
</body>
</html>
`;
};

exports.statusUpdateTemplate = (name, ticketId, subject, status) => {
  const statusColors = {
    'in_progress': '#d97706',
    'resolved': '#16a34a',
    'open': '#2563eb'
  };
  const color = statusColors[status] || '#334155';
  const displayStatus = status.replace('_', ' ').toUpperCase();

  return `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #334155; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
  .header { background: #f1f5f9; padding: 20px; text-align: center; border-bottom: 3px solid ${color}; }
  .header h1 { margin: 0; font-size: 20px; color: #0f172a; }
  .content { padding: 30px; line-height: 1.6; }
  .status-badge { display: inline-block; padding: 6px 12px; background: ${color}20; color: ${color}; border-radius: 20px; font-weight: bold; font-size: 14px; }
  .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Ticket Status Update</h1>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>There has been an update to your support ticket <strong>${ticketId}</strong> ("${subject}").</p>
      <p>The current status is now: <span class="status-badge">${displayStatus}</span></p>
      <p>If you have any further questions, simply reply to this email or visit your dashboard.</p>
      <p>Best regards,<br>RMS Support Team</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Recruitment Management System. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
};
