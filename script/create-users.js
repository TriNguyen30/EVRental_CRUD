// create-users.js
const bcrypt = require("bcrypt");
const { AppDataSource } = require("./config/database");

const users = [
    { email: "staff1@example.com", password: "staff123", fullName: "Staff Một", role: "Staff", id: "acc-staff-001", staffId: "staff-001" },
    { email: "renter1@example.com", password: "renter123", fullName: "Khách Một", role: "Renter", id: "acc-renter-001", renterId: "renter-001" },
];

async function createUsers() {
    await AppDataSource.initialize();
    const accountRepo = AppDataSource.getRepository("Account");
    const staffRepo = AppDataSource.getRepository("Staff");
    const renterRepo = AppDataSource.getRepository("Renter");

    for (const user of users) {
        const hash = await bcrypt.hash(user.password, 10);
        const account = accountRepo.create({
            AccountID: user.id,
            Email: user.email,
            PasswordHash: hash,
            FullName: user.fullName,
            Role: user.role,
            Status: "Active",
        });
        await accountRepo.save(account);

        if (user.role === "Staff" && user.staffId) {
            await staffRepo.save({ StaffID: user.staffId, AccountID: user.id });
        }
        if (user.role === "Renter" && user.renterId) {
            await renterRepo.save({ RenterID: user.renterId, AccountID: user.id });
        }

        console.log(`Tạo thành công: ${user.email} / ${user.password}`);
    }

    console.log("Tất cả tài khoản đã được tạo!");
    process.exit();
}

createUsers();