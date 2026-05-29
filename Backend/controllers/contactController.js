const ContactMessage = require("../models/ContactMessage");
const sendEmail = require("../utils/sendEmail");
const { userAutoReplyTemplate, adminNotificationTemplate, statusUpdateTemplate } = require("../utils/emailTemplates");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

// Helper to escape HTML to prevent XSS in plain text bodies if needed
const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

exports.createContactMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { name, email, subject, message, category, priority } = req.body;
    
    // Process attachments
    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        attachments.push(file.filename);
      });
    }

    // Generate unique Ticket ID
    const ticketId = `TKT-${uuidv4().substring(0, 8).toUpperCase()}`;

    const contact = await ContactMessage.create({
      ticketId,
      userId: req.user ? req.user._id : null, // If auth middleware is applied optionally
      name,
      email: email.toLowerCase(),
      subject,
      message,
      category: category || "General Support",
      priority: priority || "Medium",
      attachments,
      history: [{ status: "open", note: "Ticket created" }]
    });

    const receiver = process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_TO || process.env.EMAIL_USER;

    try {
      // 1. Send notification to admin
      const adminAttachments = attachments.map(filename => ({
        filename,
        path: path.join(__dirname, "../uploads/", filename)
      }));

      const adminEmailResult = await sendEmail({
        to: receiver,
        replyTo: email,
        subject: `[${priority} Priority] New Support Ticket: ${ticketId}`,
        html: adminNotificationTemplate(ticketId, name, email, contact.category, contact.priority, subject, message, attachments),
        attachments: adminAttachments
      });

      if (adminEmailResult.skipped) {
        contact.emailStatus = "not_configured";
        contact.emailError = "SMTP email settings are not configured";
      } else {
        contact.emailStatus = "sent";
        contact.emailError = "";

        // 2. Send auto-reply to user
        sendEmail({
          to: email,
          subject: `We received your message: ${subject} [${ticketId}]`,
          html: userAutoReplyTemplate(name, ticketId, subject)
        }).catch(err => console.error("Failed to send auto-reply to user", err));
      }
    } catch (mailError) {
      contact.emailStatus = "failed";
      contact.emailError = mailError.message || "Email delivery failed";
    }

    await contact.save();

    if (contact.emailStatus === "failed" || contact.emailStatus === "not_configured") {
      return res.status(202).json({
        message: contact.emailStatus === "not_configured"
            ? "Ticket created, but email is not configured on the server."
            : "Ticket created, but email delivery failed.",
        ticket: { id: contact.ticketId, status: contact.status }
      });
    }

    res.status(201).json({
      message: "Message sent successfully",
      ticket: { id: contact.ticketId, status: contact.status }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getContactMessages = async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const messages = await ContactMessage.find(query).sort({ createdAt: -1 });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateContactStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });
    if (!["open", "in_progress", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const contact = await ContactMessage.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact message not found" });

    contact.status = status;
    contact.history.push({ status, note: note || `Status updated to ${status}` });
    await contact.save();

    // Send status update email to user
    sendEmail({
      to: contact.email,
      subject: `Ticket Update: ${contact.ticketId}`,
      html: statusUpdateTemplate(contact.name, contact.ticketId, contact.subject, status)
    }).catch(err => console.error("Failed to send status update email", err));

    res.json({ message: "Status updated successfully", contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserTickets = async (req, res) => {
  try {
    const userId = req.user._id;
    // We can also fetch by email if userId wasn't populated when they were logged out
    const messages = await ContactMessage.find({
      $or: [{ userId }, { email: req.user.email }]
    }).sort({ createdAt: -1 });
    
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// AI Smart Assistant - Keyword based fast matching
exports.getAiSuggestions = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.length < 5) {
      return res.json({ suggestions: [] });
    }

    const text = message.toLowerCase();
    const suggestions = [];

    // Knowledge base rules
    if (text.includes("password") || text.includes("login") || text.includes("sign in") || text.includes("access")) {
      suggestions.push({
        title: "Reset your password",
        description: "If you forgot your password, you can reset it using the 'Forgot Password' link on the login page.",
        actionUrl: "/login",
        actionText: "Go to Login"
      });
    }

    if (text.includes("apply") || text.includes("application") || text.includes("resume") || text.includes("cv")) {
      suggestions.push({
        title: "How to track your application",
        description: "You can view the status of all your job applications from your Candidate Dashboard.",
        actionUrl: "/candidate",
        actionText: "View Dashboard"
      });
    }

    if (text.includes("post") || text.includes("job") || text.includes("hire") || text.includes("recruiter")) {
      suggestions.push({
        title: "Posting a new job",
        description: "Recruiters can post jobs by navigating to the 'Post Job' section in the Recruiter Dashboard.",
        actionUrl: "/post-job",
        actionText: "Post a Job"
      });
    }

    if (text.includes("delete") || text.includes("remove") || text.includes("account")) {
      suggestions.push({
        title: "Account Deletion",
        description: "To delete your account and all associated data, please submit this ticket. Our admins will process it within 24 hours."
      });
    }

    res.json({ suggestions: suggestions.slice(0, 3) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
