const router = require("express").Router();
const { getJobs, postJob } = require("../controllers/jobController");
const { protect, recruiterOnly } = require("../middleware/authMiddleware");

router.get("/", getJobs);
router.post("/", protect, recruiterOnly, postJob);

module.exports = router;