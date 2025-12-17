// middleware/auth.js
const { verifyToken } = require("../utils/jwt");

const requireStaff = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || !["Staff", "Admin"].includes(decoded.Role)) {
        return res.status(403).json({ message: "Access denied" });
    }

    req.user = decoded;
    next();
};

const requireAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || decoded.Role !== "Admin") {
        return res.status(403).json({ message: "Admin access required" });
    }

    req.user = decoded;
    next();
};


const requireRenter = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: "Invalid token" });
    }
    if (decoded.Role !== "Renter") {
        return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded;
    next();
};

// middleware/auth.js
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Không có token" });

  try {
    const payload = verifyToken(token);
    req.user = payload; // Gán user vào req
    next();
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};



module.exports = { requireStaff, requireAdmin, requireRenter, requireAuth };