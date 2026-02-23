const Application = require("../models/Application");
const Job = require("../models/Job");
const sendEmail = require("../utils/sendEmail");

const STATUS_VALUES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
  "Rejected",
];

exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { applicantName, applicantEmail, applicantPhone, coverLetter } = req.body;

    if (!applicantName || !applicantEmail || !applicantPhone) {
      return res.status(400).json({ message: "Name, email, phone are required" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status !== "open") return res.status(400).json({ message: "Job is closed" });

    const exists = await Application.findOne({ job: jobId, candidate: req.user._id });
    if (exists) return res.status(409).json({ message: "Already applied to this job" });

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      applicantName,
      applicantEmail,
      applicantPhone,
      coverLetter: coverLetter || "",
      resumeFile: req.file ? `/uploads/resumes/${req.file.filename}` : "",
      status: "Applied",
    });

    sendEmail({
      to: applicantEmail,
      subject: "Application Submitted",
      text: `Your application for ${job.title} at ${job.companyName} was submitted.`,
    }).catch(() => {});

    res.status(201).json({ message: "Application submitted", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate("job", "title companyName location type")
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApplicationsForRecruiter = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.user.role !== "admin" && String(job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const applications = await Application.find({ job: jobId })
      .populate("candidate", "name email candidateProfile")
      .sort({ createdAt: -1 });

    res.json({ job, applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecruiterApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).select("_id title companyName");
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("job", "title companyName location")
      .populate("candidate", "name email candidateProfile")
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!STATUS_VALUES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(applicationId).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (req.user.role !== "admin" && String(application.job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    application.status = status;
    await application.save();

    sendEmail({
      to: application.applicantEmail,
      subject: "Application Status Updated",
      text: `Your application status for ${application.job.title} is now: ${status}`,
    }).catch(() => {});

    res.json({ message: "Status updated", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.scheduleInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { date, time, mode, meetingLink, notes } = req.body;

    const application = await Application.findById(applicationId).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (req.user.role !== "admin" && String(application.job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    application.interview = {
      date: date || "",
      time: time || "",
      mode: mode || "",
      meetingLink: meetingLink || "",
      notes: notes || "",
      scheduledBy: req.user._id,
    };
    application.status = "Interview Scheduled";
    await application.save();

    sendEmail({
      to: application.applicantEmail,
      subject: "Interview Scheduled",
      text: `Interview for ${application.job.title}\nDate: ${date}\nTime: ${time}\nMode: ${mode}\nLink: ${meetingLink || "-"}`,
    }).catch(() => {});

    res.json({ message: "Interview scheduled", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCandidateStats = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id });
    const stats = {
      appliedJobs: applications.length,
      underReview: applications.filter((a) => a.status === "Under Review").length,
      shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
      interviews: applications.filter((a) => a.status === "Interview Scheduled").length,
      selected: applications.filter((a) => a.status === "Selected").length,
      rejected: applications.filter((a) => a.status === "Rejected").length,
    };
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
