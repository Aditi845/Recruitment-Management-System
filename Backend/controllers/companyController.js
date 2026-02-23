const Company = require("../models/Company");
const User = require("../models/User");
const Job = require("../models/Job");

exports.createOrUpdateMyCompany = async (req, res) => {
  try {
    const { name, about, website } = req.body;
    if (!name) return res.status(400).json({ message: "Company name is required" });

    let company = null;
    if (req.user.company) {
      company = await Company.findById(req.user.company);
    }

    if (!company) {
      company = await Company.create({
        name,
        about: about || "",
        website: website || "",
        logo: req.file ? `/uploads/logos/${req.file.filename}` : "",
        recruiter: req.user._id,
      });

      await User.findByIdAndUpdate(req.user._id, { company: company._id });
    } else {
      company.name = name;
      company.about = about || company.about;
      company.website = website || company.website;
      if (req.file) company.logo = `/uploads/logos/${req.file.filename}`;
      await company.save();
    }

    res.json({ message: "Company profile saved", company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyCompany = async (req, res) => {
  try {
    if (!req.user.company) return res.json({ company: null });
    const company = await Company.findById(req.user.company);
    res.json({ company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate("recruiter", "name email");
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCompanies = async (_req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    const formatted = await Promise.all(
      companies.map(async (company) => {
        const jobsCount = await Job.countDocuments({
          $or: [{ company: company._id }, { companyName: company.name }],
          status: "open",
        });
        const avgRating =
          company.ratings.length > 0
            ? (
                company.ratings.reduce((sum, r) => sum + (r.rating || 0), 0) /
                company.ratings.length
              ).toFixed(1)
            : "0.0";
        return {
          ...company.toObject(),
          jobsCount,
          avgRating: Number(avgRating),
          followersCount: company.followers.length,
        };
      })
    );
    res.json({ companies: formatted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCompanyJobs = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const jobs = await Job.find({
      $or: [{ company: company._id }, { companyName: company.name }],
      status: "open",
    }).sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.followCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const userId = String(req.user._id);
    const exists = company.followers.some((id) => String(id) === userId);

    if (exists) {
      company.followers = company.followers.filter((id) => String(id) !== userId);
    } else {
      company.followers.push(req.user._id);
    }

    await company.save();
    res.json({
      message: exists ? "Company unfollowed" : "Company followed",
      followed: !exists,
      followersCount: company.followers.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rateCompany = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const value = Number(rating);
    if (value < 1 || value > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const existing = company.ratings.find((r) => String(r.user) === String(req.user._id));
    if (existing) {
      existing.rating = value;
      existing.review = review || existing.review || "";
    } else {
      company.ratings.push({ user: req.user._id, rating: value, review: review || "" });
    }

    await company.save();

    const avgRating =
      company.ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / company.ratings.length;

    res.json({
      message: "Rating saved",
      avgRating: Number(avgRating.toFixed(1)),
      ratingsCount: company.ratings.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
