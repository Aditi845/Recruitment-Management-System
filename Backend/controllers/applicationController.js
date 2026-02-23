const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");

const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, resumeUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: "Invalid job id." });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    if (job.status !== "open") {
      return res.status(400).json({ success: false, message: "This job is closed." });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user._id,
    });
    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      coverLetter,
      resumeUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate("job")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getApplicationsForRecruiter = async (req, res) => {
  try {
    const { jobId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: "Invalid job id." });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    const isOwner = job.createdBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not allowed to view applications for this job.",
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate("candidate", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ success: false, message: "Invalid application id." });
    }

    if (!["applied", "shortlisted", "rejected", "interview"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const application = await Application.findById(applicationId).populate("job");
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    const isOwner = application.job.createdBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not allowed to update this application." });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated.",
      application,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getCandidateStats = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id });

    const stats = applications.reduce(
      (acc, app) => {
        acc.appliedJobs += 1;
        if (app.status === "interview") acc.interviews += 1;
        return acc;
      },
      { appliedJobs: 0, interviews: 0, savedJobs: 0 }
    );

    return res.status(200).json({ success: true, stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationsForRecruiter,
  updateApplicationStatus,
  getCandidateStats,
};
