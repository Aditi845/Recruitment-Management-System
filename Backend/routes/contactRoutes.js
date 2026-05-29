const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { body } = require("express-validator");
const {
  createContactMessage,
  getContactMessages,
  updateContactStatus,
  getAiSuggestions,
  getUserTickets
} = require("../controllers/contactController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Setup Multer for attachments
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Validation middleware
const contactValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("subject").trim().notEmpty().withMessage("Subject is required"),
  body("message").trim().isLength({ min: 10 }).withMessage("Message must be at least 10 characters")
];

// Optional auth middleware helper to populate req.user if token exists, but not fail if it doesn't
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    // If we want to strictly tie it, we can use protect middleware. 
    // Here we'll just let protect do its job if we wrap it.
    // For now, let's keep the contact route public but use optionalAuth if we want.
    // To keep it simple, we will use protect on /my-tickets.
  }
  next();
};

router.post("/", upload.array("attachments", 3), contactValidation, createContactMessage);
router.post("/ai-suggest", getAiSuggestions);

router.get("/my-tickets", protect, getUserTickets);

router.get("/", protect, adminOnly, getContactMessages);
router.patch("/:id/status", protect, adminOnly, updateContactStatus);

module.exports = router;
