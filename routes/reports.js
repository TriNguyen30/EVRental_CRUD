// routes/reports.js
const express = require("express");
const router = express.Router();
const { createReport, getAllReports, updateReportStatus } = require("../controllers/reportController");
const { requireAdmin, requireStaff } = require("../middleware/auth");
const { AppDataSource } = require("../config/database");
const reportRepo = AppDataSource.getRepository("Report");

router.post("/", requireStaff, createReport);
router.get("/", requireAdmin, getAllReports);
router.put("/:reportId/status", requireAdmin, updateReportStatus);

router.get("/recent", requireAdmin, async (req, res) => {
    const data = await reportRepo.find({
        relations: ["Renter", "Renter.Account"],
        order: { CreatedAt: "DESC" },
        take: 5,
    });
    res.json({ data });
});

module.exports = router;