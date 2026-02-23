const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.recruiterOnly = (req, res, next) => {
  if (req.user.role !== "recruiter")
    return res.status(403).json({ message: "Recruiter only" });

  next();
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  next();
};

exports.allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Not allowed" });
  }
  next();
};

// Backward-compatible aliases used by some existing route files
exports.authMiddleware = exports.protect;
exports.authorizeRoles = exports.allowRoles;
