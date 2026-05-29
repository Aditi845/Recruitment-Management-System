const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    category: { type: String, default: "General Support" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    attachments: [{ type: String }],
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved"],
      default: "open",
    },
    emailStatus: {
      type: String,
      enum: ["pending", "sent", "failed", "not_configured"],
      default: "pending",
    },
    emailError: { type: String, default: "" },
    history: [
      {
        status: String,
        updatedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
