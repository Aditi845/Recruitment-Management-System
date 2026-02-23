const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicantName: { type: String, required: true, trim: true },
    applicantEmail: { type: String, required: true, trim: true, lowercase: true },
    applicantPhone: { type: String, required: true, trim: true },
    coverLetter: { type: String, trim: true, default: "" },
    resumeFile: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview Scheduled",
        "Selected",
        "Rejected",
      ],
      default: "Applied",
    },
    interview: {
      date: { type: String, default: "" },
      time: { type: String, default: "" },
      mode: { type: String, enum: ["", "online", "offline"], default: "" },
      meetingLink: { type: String, default: "" },
      notes: { type: String, default: "" },
      scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
