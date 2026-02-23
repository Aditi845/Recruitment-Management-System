const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
    location: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Full Time", "Part Time", "Internship", "Remote", "Contract"],
      required: true,
    },
    salary: { type: String, default: "" },
    experienceLevel: { type: String, default: "" },
    description: { type: String, required: true },
    skillsRequired: [{ type: String }],
    status: { type: String, enum: ["open", "closed"], default: "open" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
