// controllers/bookingController.js
const { AppDataSource } = require("../config/database");

const bookingRepo = AppDataSource.getRepository("Booking");

// GET /api/bookings (Admin) – Lọc, tìm kiếm, phân trang
const getAllBookings = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status } = req.query;
        const skip = (page - 1) * limit;

        const qb = await bookingRepo
            .createQueryBuilder("b")
            .leftJoinAndSelect("b.Renter", "r")
            .leftJoinAndSelect("r.Account", "a")
            .leftJoinAndSelect("b.Vehicle", "v");

        if (search) {
            qb.andWhere("(a.FullName LIKE :search OR v.LicensePlate LIKE :search)", { search: `%${search}%` });
        }
        if (status && status !== "All") {
            qb.andWhere("b.Status = :status", { status });
        }

        const [data, total] = await qb
            .orderBy("b.StartTime", "DESC")
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        const enriched = data.map(b => {
            // FIX 1: Kiểm tra Renter và Account
            const renterName = b.Renter?.Account?.FullName || "Unknown";
            const renterEmail = b.Renter?.Account?.Email || "N/A";

            return {
                BookingID: b.BookingID,
                Renter: { FullName: renterName, Email: renterEmail },
                Vehicle: {
                    LicensePlate: b.Vehicle?.LicensePlate || "N/A",
                    Brand: b.Vehicle?.Brand || "N/A",
                    Model: b.Vehicle?.Model || "N/A"
                },
                StartTime: b.StartTime,
                EndTime: b.EndTime,
                DepositAmount: parseFloat(b.DepositAmount) || 0,
                Status: b.Status,
                Duration: Math.round((new Date(b.EndTime) - new Date(b.StartTime)) / 3600000),
                TotalCost: parseFloat(b.DepositAmount) || 0,
            };
        });

        res.json({
            data: enriched,
            total,
            page: +page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        // FIX 2: Log lỗi rõ ràng
        console.error("=== GET ALL BOOKINGS ERROR ===");
        console.error("Message:", err.message);
        console.error("Stack:", err.stack);
        console.error("=================================");
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// GET /api/bookings/my (Renter) – Lịch sử cá nhân + thống kê
const getMyBookings = async (req, res) => {
    const renterId = req.user.RenterID;
    try {
        const data = await bookingRepo
                .createQueryBuilder("b")
                .leftJoinAndSelect("b.Vehicle", "v")
                .where("b.RenterID = :renterId", { renterId })
                .orderBy("b.StartTime", "DESC")
                .getMany();

        const enriched = data.map(b => ({
            BookingID: b.BookingID,
            Vehicle: {
                LicensePlate: b.Vehicle?.LicensePlate || "N/A",
                Brand: b.Vehicle?.Brand || "N/A"
            },
            StartTime: b.StartTime,
            EndTime: b.EndTime,
            DepositAmount: parseFloat(b.DepositAmount) || 0,
            Status: b.Status,
            Duration: Math.round((new Date(b.EndTime) - new Date(b.StartTime)) / 3600000),
            TotalCost: parseFloat(b.DepositAmount) || 0,
        }));

        const totalTrips = enriched.length;
        const totalCost = enriched.reduce((sum, b) => sum + b.TotalCost, 0);

        const peakHours = await AppDataSource.getRepository("Booking")
            .createQueryBuilder()
            .select("HOUR(b.StartTime)", "hour")
            .addSelect("COUNT(*)", "count")
            .where("b.RenterID = :renterId", { renterId })
            .groupBy("hour")
            .orderBy("count", "DESC")
            .getRawMany();

        res.json({
            data: enriched,
            stats: { totalTrips, totalCost, peakHours }
        });
    } catch (err) {
        console.error("getMyBookings error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { getAllBookings, getMyBookings };