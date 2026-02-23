const Job = require("../models/Job");

exports.getJobs = async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
};

exports.postJob = async (req, res) => {
  const job = await Job.create({
    ...req.body,
    postedBy: req.user.id
  });

  res.json(job);
};