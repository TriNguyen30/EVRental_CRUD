// controllers/authController.js
const bcrypt = require("bcrypt");
const { AppDataSource } = require("../config/database");
const { generateToken } = require("../utils/jwt");

const accountRepo = AppDataSource.getRepository("Account");
const staffRepo = AppDataSource.getRepository("Staff");
const renterRepo = AppDataSource.getRepository("Renter");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
        }

        // BƯỚC 1: Tìm Account
        const account = await accountRepo.findOne({
            where: { Email: email },
        });

        if (!account || account.Status !== "Active") {
            return res.status(401).json({ message: "Tài khoản không tồn tại hoặc bị khóa" });
        }

        // BƯỚC 2: Kiểm tra mật khẩu
        const isValid = await bcrypt.compare(password, account.PasswordHash);
        if (!isValid) {
            return res.status(401).json({ message: "Mật khẩu không đúng" });
        }

        // BƯỚC 3 & 4: Lấy ID vai trò để nhúng vào token
        let staffId = null;
        let renterId = null;
        if (account.Role === "Staff") {
            const staff = await staffRepo.findOne({ where: { AccountID: account.AccountID } });
            if (staff) staffId = staff.StaffID;
        }
        if (account.Role === "Renter") {
            const renter = await renterRepo.findOne({ where: { AccountID: account.AccountID } });
            if (renter) renterId = renter.RenterID;
        }

        const payload = {
            AccountID: account.AccountID,
            Email: account.Email,
            FullName: account.FullName,
            Role: account.Role,
            StaffID: staffId,
            RenterID: renterId,
        };
        const token = generateToken(payload);

        res.json({
            message: "Đăng nhập thành công",
            token,
            user: payload,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { login };