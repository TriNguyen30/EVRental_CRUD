// routes/renters.js
const express = require("express");
const router = express.Router();
const { getRenters, getRenterById, getMyHistory, getMyStats, getDriverLicenseByRenterId } = require("../controllers/renterController");
const { requireAdmin, requireRenter } = require("../middleware/auth");

// Renter self endpoints MUST be defined before parameterized routes
// GET /api/renters/my/history
router.get("/history", requireRenter, getMyHistory);

// GET /api/renters/my/stats
router.get("/stats", requireRenter, getMyStats);

// Admin endpoints
// GET /api/renters
router.get("/", requireAdmin, getRenters);

// GET /api/renters/:id/driver-license - MUST be before /:id route
router.get("/:id/driver-license", requireAdmin, getDriverLicenseByRenterId);

// GET /api/renters/:id
router.get("/:id", requireAdmin, getRenterById);

module.exports = router;