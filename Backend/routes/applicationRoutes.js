const router = require("express").Router();
const {
  applyToJob,
  getMyApplications,
  getApplicationsForRecruiter,
  getRecruiterApplications,
  updateApplicationStatus,
  scheduleInterview,
  getCandidateStats,
} = require("../controllers/applicationController");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const { resumeUpload } = require("../middleware/uploadMiddleware");

router.post(
  "/job/:jobId/apply",
  protect,
  allowRoles("candidate"),
  resumeUpload.single("resume"),
  applyToJob
);
router.get("/me", protect, allowRoles("candidate"), getMyApplications);
router.get("/candidate/stats", protect, allowRoles("candidate"), getCandidateStats);

router.get("/recruiter/all", protect, allowRoles("recruiter", "admin"), getRecruiterApplications);
router.get("/job/:jobId", protect, allowRoles("recruiter", "admin"), getApplicationsForRecruiter);
router.patch("/:applicationId/status", protect, allowRoles("recruiter", "admin"), updateApplicationStatus);
router.patch(
  "/:applicationId/interview",
  protect,
  allowRoles("recruiter", "admin"),
  scheduleInterview
);

module.exports = router;
