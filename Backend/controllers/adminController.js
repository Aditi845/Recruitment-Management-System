const User = require("../models/User");
const Job = require("../models/Job");
const Company = require("../models/Company");
const Application = require("../models/Application");

exports.getAdminDashboard = async (_req, res) => {
  try {
    const [users, jobs, companies, applications] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Company.countDocuments(),
      Application.countDocuments(),
    ]);

    res.json({ stats: { users, jobs, companies, applications } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password").populate("company", "name");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllJobs = async (_req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCompanies = async (_req, res) => {
  try {
    const companies = await Company.find().populate("recruiter", "name email");
    res.json({ companies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllApplications = async (_req, res) => {
  try {
    const applications = await Application.find()
      .populate("job", "title companyName")
      .populate("candidate", "name email");
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
