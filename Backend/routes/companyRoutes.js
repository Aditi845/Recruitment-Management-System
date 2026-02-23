const router = require("express").Router();
const {
  createOrUpdateMyCompany,
  getMyCompany,
  getCompanyById,
  getCompanies,
  getCompanyJobs,
  followCompany,
  rateCompany,
} = require("../controllers/companyController");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const { companyLogoUpload } = require("../middleware/uploadMiddleware");

router.get("/me/profile", protect, allowRoles("recruiter", "admin"), getMyCompany);
router.get("/:id/jobs", getCompanyJobs);
router.post("/:id/follow", protect, allowRoles("candidate", "recruiter", "admin"), followCompany);
router.post("/:id/rate", protect, allowRoles("candidate", "recruiter", "admin"), rateCompany);
router.post(
  "/me/profile",
  protect,
  allowRoles("recruiter", "admin"),
  companyLogoUpload.single("logo"),
  createOrUpdateMyCompany
);
router.get("/", getCompanies);
router.get("/:id", getCompanyById);
router.put(
  "/me/profile",
  protect,
  allowRoles("recruiter", "admin"),
  companyLogoUpload.single("logo"),
  createOrUpdateMyCompany
);

module.exports = router;
