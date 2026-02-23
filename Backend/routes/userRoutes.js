const express = require("express");
const { getMyProfile, updateCandidateProfile, getCandidateProfileById } = require("../controllers/userController");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const { resumeUpload, profilePhotoUpload } = require("../middleware/uploadMiddleware");

const router = express.Router();
router.get("/me", protect, getMyProfile);
router.put("/me/candidate-profile", protect, allowRoles("candidate", "admin"), updateCandidateProfile);
router.get("/candidate/:id", protect, allowRoles("recruiter", "admin"), getCandidateProfileById);

router.post(
  "/me/candidate-profile/resume",
  protect,
  allowRoles("candidate", "admin"),
  resumeUpload.single("resume"),
  (req, res, next) => {
    req.body = { ...req.body };
    req.files = { resumeFile: req.file ? [req.file] : [] };
    next();
  },
  updateCandidateProfile
);

router.post(
  "/me/candidate-profile/photo",
  protect,
  allowRoles("candidate", "admin"),
  profilePhotoUpload.single("photo"),
  (req, res, next) => {
    req.body = { ...req.body };
    req.files = { profilePhoto: req.file ? [req.file] : [] };
    next();
  },
  updateCandidateProfile
);

module.exports = router;
