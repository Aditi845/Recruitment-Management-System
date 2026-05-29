const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadsDir = path.join(__dirname, "..", "uploads");
const resumesDir = path.join(uploadsDir, "resumes");
const profileDir = path.join(uploadsDir, "profiles");
const logosDir = path.join(uploadsDir, "logos");

[uploadsDir, resumesDir, profileDir, logosDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const createStorage = (folder) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(uploadsDir, folder)),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  });

const pdfOnly = (_req, file, cb) => {
  if (file.mimetype === "application/pdf") return cb(null, true);
  cb(new Error("Upload failed: Only PDF format is accepted for resumes."));
};

const imageOnly = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) return cb(null, true);
  cb(new Error("Upload failed: Only image formats (JPG, PNG) are accepted."));
};

const resumeUpload = multer({ storage: createStorage("resumes"), fileFilter: pdfOnly });
const profilePhotoUpload = multer({ storage: createStorage("profiles"), fileFilter: imageOnly });
const companyLogoUpload = multer({ storage: createStorage("logos"), fileFilter: imageOnly });

module.exports = { resumeUpload, profilePhotoUpload, companyLogoUpload };
