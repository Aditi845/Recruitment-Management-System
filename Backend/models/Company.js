const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    about: { type: String, default: "" },
    website: { type: String, default: "" },
    logo: { type: String, default: "" },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String, default: "" },
      },
    ],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
