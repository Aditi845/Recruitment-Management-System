const Job = require("../models/Job");
const Application = require("../models/Application");
const Company = require("../models/Company");

exports.getJobs = async (req, res) => {
  try {
    const { search, location, company, type } = req.query;
    const query = { status: "open" };

    if (search) query.title = { $regex: search, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };
    if (company) query.companyName = { $regex: company, $options: "i" };
    if (type) query.type = type;

    const jobs = await Job.find(query)
      .populate("postedBy", "name email")
      .populate("company", "name website logo")
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("postedBy", "name email")
      .populate("company", "name website logo about");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.postJob = async (req, res) => {
  try {
    const { title, location, type, salary, experienceLevel, description, companyName, skillsRequired } =
      req.body;

    if (!title || !location || !type || !description) {
      return res.status(400).json({ message: "title, location, type, description are required" });
    }

    let companyRef = null;
    let finalCompanyName = companyName || "";

    if (req.user.company) {
      const company = await Company.findById(req.user.company);
      if (company) {
        companyRef = company._id;
        if (!finalCompanyName) finalCompanyName = company.name;
      }
    }

    const job = await Job.create({
      title,
      companyName: finalCompanyName || "Company",
      company: companyRef,
      location,
      type,
      salary: salary || "",
      experienceLevel: experienceLevel || "",
      description,
      skillsRequired: Array.isArray(skillsRequired)
        ? skillsRequired
        : typeof skillsRequired === "string" && skillsRequired.trim()
        ? skillsRequired.split(",").map((s) => s.trim())
        : [],
      postedBy: req.user._id,
    });

    res.status(201).json({ message: "Job posted", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.user.role !== "admin" && String(job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json({ message: "Job updated", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.user.role !== "admin" && String(job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Application.deleteMany({ job: job._id });
    await job.deleteOne();

    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecruiterDashboard = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).select("_id");
    const jobIds = jobs.map((j) => j._id);

    const [jobsPosted, applications, shortlisted, interviews] = await Promise.all([
      Job.countDocuments({ postedBy: req.user._id }),
      Application.countDocuments({ job: { $in: jobIds } }),
      Application.countDocuments({ job: { $in: jobIds }, status: "Shortlisted" }),
      Application.countDocuments({ job: { $in: jobIds }, status: "Interview Scheduled" }),
    ]);

    res.json({
      stats: {
        jobsPosted,
        applications,
        shortlisted,
        interviewsScheduled: interviews,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
