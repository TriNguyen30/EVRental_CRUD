// routes/risks.js
const express = require("express");
const router = express.Router();
const { getRiskyRenters } = require("../controllers/riskController");
const { requireAdmin } = require("../middleware/auth");

router.get("/", requireAdmin, getRiskyRenters);

module.exports = router;