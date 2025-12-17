// controllers/reportController.js
const { AppDataSource } = require("../config/database");

const reportRepo = AppDataSource.getRepository("Report");

const createReport = async (req, res) => {
    try {
        const { ReportType, RenterID, VehicleID, ReportDetails, IsHighRisk } = req.body;
        const StaffID = req.user.StaffID;

        const report = reportRepo.create({
            ReportType,
            RenterID: RenterID || null,
            StaffID,
            VehicleID: VehicleID || null,
            ReportDetails,
            IsHighRisk: !!IsHighRisk,
            Status: "Open",
        });

        const saved = await reportRepo.save(report);
        res.status(201).json({ message: "Tạo báo cáo thành công", data: saved });
    } catch (err) {
        console.error("createReport error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getAllReports = async (req, res) => {
    try {
        const { page = 1, limit = 10, searchDetails, reportId, renterName, isHighRisk, status } = req.query;
        const skip = (page - 1) * limit;

        // Query builder với relations
        const qb = reportRepo.createQueryBuilder("r")
            .leftJoinAndSelect("r.Renter", "ren")
            .leftJoinAndSelect("ren.Account", "acc")
            .leftJoinAndSelect("r.Staff", "staff")
            .leftJoinAndSelect("staff.Account", "staffAcc")
            .leftJoinAndSelect("r.Vehicle", "v");

        // Áp dụng filters
        if (searchDetails) qb.andWhere("r.ReportDetails LIKE :details", { details: `%${searchDetails}%` });
        if (reportId) qb.andWhere("r.ReportID = :id", { id: +reportId });
        if (renterName) qb.andWhere("acc.FullName LIKE :name", { name: `%${renterName}%` });
        if (isHighRisk !== undefined) qb.andWhere("r.IsHighRisk = :risk", { risk: isHighRisk === "true" });
        if (status && status !== "All") qb.andWhere("r.Status = :status", { status });

        // Lấy data và count cùng lúc
        const [data, total] = await qb
            .orderBy("r.CreatedAt", "DESC")
            .skip(skip)
            .take(+limit)
            .getManyAndCount();

        // Map data theo format frontend mong đợi
        const enriched = data.map(report => ({
            ReportID: report.ReportID,
            ReportType: report.ReportType,
            ReportDetails: report.ReportDetails,
            Status: report.Status,
            IsHighRisk: report.IsHighRisk,
            CreatedAt: report.CreatedAt,
            ResolvedAt: report.ResolvedAt,
            Renter: report.Renter && report.Renter.Account ? {
                RenterID: report.Renter.RenterID,
                Account: {
                    FullName: report.Renter.Account.FullName,
                    Email: report.Renter.Account.Email
                }
            } : null,
            Staff: report.Staff && report.Staff.Account ? {
                StaffID: report.Staff.StaffID,
                Account: {
                    FullName: report.Staff.Account.FullName
                }
            } : null,
            Vehicle: report.Vehicle ? {
                LicensePlate: report.Vehicle.LicensePlate
            } : null,
        }));

        res.json({
            data: enriched,
            total,
            page: +page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error("getReports error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const updateReportStatus = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status } = req.body;

        const updateData = { Status: status };
        if (status === "Closed") updateData.ResolvedAt = new Date();

        await reportRepo.update(reportId, updateData);
        res.json({ message: "Cập nhật trạng thái thành công" });
    } catch (err) {
        console.error("updateReportStatus error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { createReport, getAllReports, updateReportStatus };