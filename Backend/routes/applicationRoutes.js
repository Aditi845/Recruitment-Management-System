const express = require("express");
const {
  applyToJob,
  getMyApplications,
  getApplicationsForRecruiter,
  updateApplicationStatus,
  getCandidateStats,
} = require("../controllers/applicationController");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/job/:jobId", authMiddleware, authorizeRoles("candidate"), applyToJob);
router.get("/me", authMiddleware, authorizeRoles("candidate"), getMyApplications);
router.get(
  "/dashboard/candidate/stats",
  authMiddleware,
  authorizeRoles("candidate", "admin"),
  getCandidateStats
);
router.get(
  "/job/:jobId",
  authMiddleware,
  authorizeRoles("recruiter", "admin"),
  getApplicationsForRecruiter
);
router.patch(
  "/:applicationId/status",
  authMiddleware,
  authorizeRoles("recruiter", "admin"),
  updateApplicationStatus
);

module.exports = router;
