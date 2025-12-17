// controllers/profileController.js
const { AppDataSource } = require("../config/database");

const accountRepo = AppDataSource.getRepository("Account");
const renterRepo = AppDataSource.getRepository("Renter");

const getProfile = async (req, res) => {
    try {
        const accountId = req.user.AccountID;
        const account = await accountRepo.findOne({ where: { AccountID: accountId } });
        if (!account) return res.status(404).json({ message: "Account not found" });

        // Base profile
        const profile = {
            FullName: account.FullName,
            Email: account.Email,
            PhoneNumber: account.PhoneNumber || "",
            Address: "",
            DateOfBirth: "",
            IdentityNumber: "",
        };

        // If renter, merge renter details
        if (req.user.Role === "Renter") {
            const renter = await renterRepo.findOne({ where: { AccountID: accountId } });
            if (renter) {
                profile.Address = renter.Address || "";
                profile.DateOfBirth = renter.DateOfBirth || "";
                profile.IdentityNumber = renter.IdentityNumber || "";
            }
        }

        res.json({ data: profile });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const accountId = req.user.AccountID;
        const { FullName, PhoneNumber, Address, DateOfBirth, IdentityNumber } = req.body;

        const account = await accountRepo.findOne({ where: { AccountID: accountId } });
        if (!account) return res.status(404).json({ message: "Account not found" });

        if (typeof FullName === "string") account.FullName = FullName;
        if (typeof PhoneNumber === "string") account.PhoneNumber = PhoneNumber;
        await accountRepo.save(account);

        if (req.user.Role === "Renter") {
            let renter = await renterRepo.findOne({ where: { AccountID: accountId } });
            if (!renter) {
                renter = renterRepo.create({ AccountID: accountId });
            }
            if (typeof Address === "string") renter.Address = Address;
            if (typeof DateOfBirth === "string") renter.DateOfBirth = DateOfBirth;
            if (typeof IdentityNumber === "string") renter.IdentityNumber = IdentityNumber;
            await renterRepo.save(renter);
        }

        res.json({ message: "Cập nhật thành công" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getProfile, updateProfile };