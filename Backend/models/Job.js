const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  type: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Job", jobSchema);