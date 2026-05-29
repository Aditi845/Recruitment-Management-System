const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.error("Protect: No token provided");
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.error("Protect: User not found for ID", decoded.id);
      return res.status(401).json({ message: "User not found" });
    }
    
    // Fallback for legacy users created before the role field was added
    if (!user.role) user.role = "candidate";
    
    req.user = user;
    next();
  } catch (error) {
    console.error("Protect: Invalid token:", error.message);
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
  console.log("allowRoles check:", req.method, req.originalUrl, "User role:", req.user?.role, "Expected:", roles);
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Not allowed" });
  }
  next();
};

// Backward-compatible aliases used by some existing route files
exports.authMiddleware = exports.protect;
exports.authorizeRoles = exports.allowRoles;
