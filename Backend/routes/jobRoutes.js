const router = require("express").Router();
const {
  getJobs,
  getJobById,
  postJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  getRecruiterDashboard,
} = require("../controllers/jobController");
const { protect, recruiterOnly, allowRoles } = require("../middleware/authMiddleware");

router.get("/recruiter/my-jobs", protect, recruiterOnly, getRecruiterJobs);
router.get("/recruiter/dashboard/stats", protect, recruiterOnly, getRecruiterDashboard);
router.get("/", getJobs);
router.get("/:id", getJobById);

router.post("/", protect, recruiterOnly, postJob);
router.put("/:id", protect, allowRoles("recruiter", "admin"), updateJob);
router.delete("/:id", protect, allowRoles("recruiter", "admin"), deleteJob);

module.exports = router;
