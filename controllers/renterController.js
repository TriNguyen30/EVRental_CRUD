// controllers/renterController.js
const { AppDataSource } = require("../config/database");

const renterRepo = AppDataSource.getRepository("Renter");
const accountRepo = AppDataSource.getRepository("Account");
const driverLicenseRepo = AppDataSource.getRepository("DriverLicense");

// GET /api/renters - LẤY DANH SÁCH + TÌM KIẾM + PHÂN TRANG + LỌC STATUS
const getRenters = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const status = req.query.status;
        const qb = renterRepo
            .createQueryBuilder("r")
            .leftJoinAndSelect("r.Account", "a")
            .select([
                "r.RenterID",
                "r.Address",
                "r.DateOfBirth",
                "r.IdentityNumber",
                "r.FrontIdentityImageUrl",
                "r.BackIdentityImageUrl",
                "a.AccountID",
                "a.FullName",
                "a.Email",
                "a.PhoneNumber",
                "a.Status",
            ]);

        // TÌM KIẾM
        if (search) {
            qb.andWhere(
                "(a.FullName LIKE :search OR a.Email LIKE :search OR r.IdentityNumber LIKE :search OR a.PhoneNumber LIKE :search)",
                { search: `%${search}%` }
            );
        }

        // LỌC TRẠNG THÁI – CHỈ LỌC KHI KHÔNG PHẢI "All"
        if (status && status !== "All") {
            qb.andWhere("a.Status = :status", { status });
        }

        const [data, total] = await qb
            .orderBy("a.FullName", "ASC")
            .skip((+page - 1) * +limit)
            .take(+limit)
            .getManyAndCount();

        res.json({
            data,
            total,
            page: +page,
            totalPages: Math.ceil(total / +limit),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/renters/:id - LẤY CHI TIẾT 1 RENTER
const getRenterById = async (req, res) => {
    try {
        const { id } = req.params;
        const renter = await renterRepo.findOne({
            where: { RenterID: id },
            relations: ["Account"],
            select: {
                RenterID: true,
                Address: true,
                DateOfBirth: true,
                IdentityNumber: true,
                FrontIdentityImageUrl: true,
                BackIdentityImageUrl: true,
                Account: {
                    AccountID: true,
                    FullName: true,
                    Email: true,
                    PhoneNumber: true,
                    Status: true,
                },
            },
        });

        if (!renter) {
            return res.status(404).json({ message: "Renter không tồn tại" });
        }

        res.json(renter);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getMyHistory = async (req, res) => {
    try {
        const renterId = req.user.RenterID;
        if (!renterId) return res.status(403).json({ message: "Không có quyền" });

        const bookingRepo = AppDataSource.getRepository("Booking");
        const vehicleRepo = AppDataSource.getRepository("Vehicle");

        const bookings = await bookingRepo.find({
            where: { RenterID: renterId },
            relations: ["Vehicle"],
            order: { StartTime: "DESC" },
        });

        const data = bookings.map(b => ({
            BookingID: b.BookingID,
            Vehicle: {
                LicensePlate: b.Vehicle.LicensePlate,
                Brand: b.Vehicle.Brand,
            },
            StartTime: b.StartTime,
            EndTime: b.EndTime,
            DepositAmount: b.DepositAmount,
            Status: b.Status,
            Duration: Math.ceil((new Date(b.EndTime) - new Date(b.StartTime)) / (1000 * 60 * 60)),
            TotalAmount: b.TotalAmount || 0,
            createdAt: b.CreatedAt,
            canceledAt: b.CanceledAt,
        }));

        res.json({ data });
    } catch (err) {
        console.error("getMyHistory error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

const getMyStats = async (req, res) => {
    try {
        const renterId = req.user.RenterID;
        if (!renterId) return res.status(403).json({ message: "Không có quyền" });

        const bookingRepo = AppDataSource.getRepository("Booking");

        const [totalTrips, totalCost, peakData] = await Promise.all([
            bookingRepo.count({ where: { RenterID: renterId, Status: "Completed" } }),
            bookingRepo
                .createQueryBuilder("b")
                .where("b.RenterID = :id", { id: renterId })
                .andWhere("b.Status = 'Completed'")
                .select("COALESCE(SUM(b.DepositAmount), 0)", "total")
                .getRawOne(),
            bookingRepo
                .createQueryBuilder("b")
                .select("EXTRACT(HOUR FROM b.StartTime)", "hour")
                .addSelect("COUNT(*)", "count")
                .where("b.RenterID = :id", { id: renterId })
                .andWhere("b.Status = 'Completed'")
                .groupBy("hour")
                .orderBy("count", "DESC")
                .getRawMany(),
        ]);

        const peakHours = Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            count: 0,
        }));

        peakData.forEach(row => {
            const h = parseInt(row.hour);
            if (h >= 0 && h < 24) peakHours[h].count = parseInt(row.count);
        });

        res.json({
            totalTrips,
            totalCost: parseInt(totalCost.total) || 0,
            peakHours: peakHours.slice(0, 6), // Top 6 giờ cao điểm
        });
    } catch (err) {
        console.error("getMyStats error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/renters/:id/driver-license - LẤY DRIVER LICENSE CỦA RENTER
const getDriverLicenseByRenterId = async (req, res) => {
    try {
        const { id } = req.params; // RenterID
        
        const driverLicenses = await driverLicenseRepo.find({
            where: { RenterID: id },
            order: { IssuedDate: "DESC" },
        });

        res.json({ data: driverLicenses });
    } catch (err) {
        console.error("getDriverLicenseByRenterId error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getRenters,
    getRenterById,
    getMyHistory,
    getMyStats,
    getDriverLicenseByRenterId,
};