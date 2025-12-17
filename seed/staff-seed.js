// seed/staff-seed.js
require("reflect-metadata");
require("dotenv").config();
const { AppDataSource } = require("../config/database");
const bcrypt = require("bcrypt");

async function seed() {
    await AppDataSource.initialize();

    const accountRepo = AppDataSource.getRepository("Account");
    const staffRepo = AppDataSource.getRepository("Staff");

    const hash = await bcrypt.hash("123456", 10);

    const account = accountRepo.create({
        AccountID: "acc-staff-001",
        Email: "staff@example.com",
        PasswordHash: hash,
        FullName: "Nguyễn Văn Staff",
        Role: "Staff",
        Status: "Active",
    });

    await accountRepo.save(account);

    const staff = staffRepo.create({
        StaffID: "staff-001",
        AccountID: account.AccountID,
    });

    await staffRepo.save(staff);

    console.log("Staff account created!");
    process.exit();
}

seed();