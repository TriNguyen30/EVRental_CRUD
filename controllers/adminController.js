// controllers/adminController.js
const { AppDataSource } = require("../config/database");

const accountRepo = AppDataSource.getRepository("Account");
const staffRepo = AppDataSource.getRepository("Staff");
const renterRepo = AppDataSource.getRepository("Renter");
const bookingRepo = AppDataSource.getRepository("Booking");
const vehicleRepo = AppDataSource.getRepository("Vehicle");
const reportRepo = AppDataSource.getRepository("Report");

// SOFT-DELETE: Đánh dấu Inactive
const deleteAccount = async (req, res) => {
    try {
        const { accountId } = req.params;

        const account = await accountRepo.findOne({
            where: { AccountID: accountId },
        });

        if (!account) {
            return res.status(404).json({ message: "Tài khoản không tồn tại" });
        }

        if (account.Role === "Admin") {
            return res.status(403).json({ message: "Không thể xóa tài khoản Admin" });
        }

        // Cập nhật Status = Inactive
        await accountRepo.update(accountId, { Status: "Inactive" });

        res.json({ message: "Tài khoản đã bị vô hiệu hóa", accountId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// REACTIVATE: Mở lại tài khoản đã bị vô hiệu hóa
const reactivateAccount = async (req, res) => {
    try {
        const { accountId } = req.params;

        const account = await accountRepo.findOne({
            where: { AccountID: accountId },
        });

        if (!account) {
            return res.status(404).json({ message: "Tài khoản không tồn tại" });
        }

        if (account.Status === "Active") {
            return res.status(400).json({ message: "Tài khoản đã đang hoạt động" });
        }

        // Cập nhật Status = Active
        await accountRepo.update(accountId, { Status: "Active" });

        res.json({ message: "Tài khoản đã được mở lại thành công", accountId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// APPROVE: Duyệt tài khoản đang chờ duyệt
const approveAccount = async (req, res) => {
    try {
        const { accountId } = req.params;
        console.log("Approving account:", accountId);

        const account = await accountRepo.findOne({
            where: { AccountID: accountId },
        });

        if (!account) {
            return res.status(404).json({ message: "Tài khoản không tồn tại" });
        }

        if (account.Status !== "Pending") {
            return res.status(400).json({ message: "Tài khoản không ở trạng thái chờ duyệt" });
        }

        // Cập nhật Status = Active
        await accountRepo.update(accountId, { Status: "Active" });

        res.json({ message: "Tài khoản đã được duyệt thành công", accountId });
    } catch (err) {
        console.error("Error approving account:", err);
        res.status(500).json({ message: err.message });
    }
};

// HARD-DELETE (TÙY CHỌN) - XÓA THẬT
const hardDeleteAccount = async (req, res) => {
    try {
        const { accountId } = req.params;

        const account = await accountRepo.findOne({
            where: { AccountID: accountId },
            relations: ["Staff", "Renter"],
        });

        if (!account) {
            return res.status(404).json({ message: "Tài khoản không tồn tại" });
        }

        if (account.Role === "Admin") {
            return res.status(403).json({ message: "Không thể xóa Admin" });
        }

        // Xóa liên quan
        if (account.Staff) {
            await staffRepo.remove(account.Staff);
        }
        if (account.Renter) {
            await renterRepo.remove(account.Renter);
        }

        // Xóa Account
        await accountRepo.remove(account);

        res.json({ message: "Tài khoản đã bị xóa hoàn toàn", accountId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getStats = async (req, res) => {
    try {
        const [totalBookings, revenueResult, totalRenters, totalVehicles, pendingReports, highRiskCount] = await Promise.all([
            bookingRepo.count(),
            bookingRepo
                .createQueryBuilder("b")
                .where("b.Status = 'Completed'")
                .andWhere("EXTRACT(MONTH FROM b.EndTime) = EXTRACT(MONTH FROM CURRENT_DATE())")
                .andWhere("EXTRACT(YEAR FROM b.EndTime) = EXTRACT(YEAR FROM CURRENT_DATE())")
                .select("COALESCE(SUM(b.DepositAmount), 0)", "total")
                .getRawOne(),
            renterRepo.count(),
            vehicleRepo.count(),
            reportRepo.count({ where: { Status: "Open" } }),
            reportRepo.count({ where: { IsHighRisk: true } }),
        ]);

        res.json({
            totalBookings,
            totalRevenue: parseInt(revenueResult.total) || 0,
            activeRenters: totalRenters,
            totalVehicles,
            pendingReports,
            highRiskRenters: highRiskCount,
        });
    } catch (err) {
        console.error("getStats error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { deleteAccount, hardDeleteAccount, reactivateAccount, approveAccount, getStats };