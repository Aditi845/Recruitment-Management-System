const User = require("../models/User");

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").populate("company").populate("savedJobs");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCandidateProfile = async (req, res) => {
  try {
    if (req.user.role !== "candidate" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Candidate only" });
    }

    const { phone, skills, education, experience } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.candidateProfile = {
      ...user.candidateProfile,
      phone: phone ?? user.candidateProfile?.phone ?? "",
      skills: Array.isArray(skills)
        ? skills
        : typeof skills === "string"
        ? skills.split(",").map((s) => s.trim()).filter(Boolean)
        : user.candidateProfile?.skills || [],
      education: education ?? user.candidateProfile?.education ?? "",
      experience: experience ?? user.candidateProfile?.experience ?? "",
      profilePhoto: req.files?.profilePhoto?.[0]
        ? `/uploads/profiles/${req.files.profilePhoto[0].filename}`
        : user.candidateProfile?.profilePhoto ?? "",
      resumeFile: req.files?.resumeFile?.[0]
        ? `/uploads/resumes/${req.files.resumeFile[0].filename}`
        : user.candidateProfile?.resumeFile ?? "",
    };

    await user.save();
    res.json({ message: "Profile updated", user: await User.findById(user._id).select("-password") });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCandidateProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("company", "name website logo");

    if (!user) return res.status(404).json({ message: "Candidate not found" });
    if (user.role !== "candidate") return res.status(400).json({ message: "User is not a candidate" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleSavedJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    const isSaved = user.savedJobs.includes(jobId);
    
    if (isSaved) {
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId.toString());
    } else {
      user.savedJobs.push(jobId);
    }
    
    await user.save();
    res.json({ message: isSaved ? "Job removed from saved" : "Job saved successfully", savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
