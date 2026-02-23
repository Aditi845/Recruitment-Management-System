const router = require("express").Router();
const {
  getAdminDashboard,
  getAllUsers,
  getAllJobs,
  getAllCompanies,
  getAllApplications,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, adminOnly, getAdminDashboard);
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/jobs", protect, adminOnly, getAllJobs);
router.get("/companies", protect, adminOnly, getAllCompanies);
router.get("/applications", protect, adminOnly, getAllApplications);

module.exports = router;
