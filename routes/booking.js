// routes/bookings.js
const express = require("express");
const router = express.Router();
const { getAllBookings, getMyBookings } = require("../controllers/bookingController");
const { requireAdmin, requireRenter } = require("../middleware/auth");
const { AppDataSource } = require("../config/database");
const bookingRepo = AppDataSource.getRepository("Booking");

// Admin: Xem tất cả
router.get("/", requireAdmin, getAllBookings);

// Renter: Xem cá nhân
router.get("/my", requireRenter, getMyBookings);

router.get("/recent", requireAdmin, async (req, res) => {
    const data = await bookingRepo.find({
        relations: ["Renter", "Renter.Account", "Vehicle"],
        order: { StartTime: "DESC" },
        take: 5,
    });

    const mapped = data.map(b => ({
        BookingID: b.BookingID,
        Renter: { FullName: b.Renter?.Account?.FullName || "Unknown" },
        Vehicle: { LicensePlate: b.Vehicle?.LicensePlate || "N/A" },
        Status: b.Status,
        TotalCost: parseFloat(b.DepositAmount) || 0,
    }));

    res.json({ data: mapped });
});



module.exports = router;