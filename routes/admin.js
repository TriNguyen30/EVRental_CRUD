// routes/admin.js
const express = require("express");
const router = express.Router();
const { deleteAccount, hardDeleteAccount, reactivateAccount, approveAccount, getStats } = require("../controllers/adminController");
const { requireAdmin } = require("../middleware/auth");

// Approve account - Đặt trước để tránh conflict
router.put("/accounts/:accountId/approve", requireAdmin, approveAccount);

// Reactivate account
router.put("/accounts/:accountId/reactivate", requireAdmin, reactivateAccount);

// Soft-delete
router.delete("/accounts/:accountId", requireAdmin, deleteAccount);

// Hard-delete (tùy chọn)
router.delete("/accounts/:accountId/hard", requireAdmin, hardDeleteAccount);

router.get("/stats", requireAdmin, getStats);

module.exports = router;