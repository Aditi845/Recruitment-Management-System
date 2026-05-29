const mongoose = require("mongoose");

const candidateProfileSchema = new mongoose.Schema(
  {
    phone: { type: String, default: "" },
    skills: [{ type: String }],
    education: { type: String, default: "" },
    experience: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },
    resumeFile: { type: String, default: "" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
    candidateProfile: { type: candidateProfileSchema, default: () => ({}) },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
