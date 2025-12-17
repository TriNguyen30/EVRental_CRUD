// seed/renter-seed.js
require("reflect-metadata");
require("dotenv").config();
const { AppDataSource } = require("../config/database");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const renters = [
    {
        fullName: "Nguyễn Văn A",
        email: "renter.a@example.com",
        password: "123456",
        address: "123 Đường Láng, Hà Nội",
        dateOfBirth: "1990-05-15",
        identityNumber: "012345678901",
        frontImage: "https://i.imgur.com/abc123front.jpg", // Ảnh mẫu
        backImage: "https://i.imgur.com/abc123back.jpg",
    },
    {
        fullName: "Trần Thị B",
        email: "renter.b@example.com",
        password: "123456",
        address: "456 Lê Lợi, TP.HCM",
        dateOfBirth: "1995-08-20",
        identityNumber: "098765432109",
        frontImage: "https://i.imgur.com/def456front.jpg",
        backImage: "https://i.imgur.com/def456back.jpg",
    },
    {
        fullName: "Lê Văn C",
        email: "renter.c@example.com",
        password: "123456",
        address: "789 Nguyễn Huệ, Đà Nẵng",
        dateOfBirth: "1988-12-10",
        identityNumber: "111222333444",
        frontImage: "https://i.imgur.com/ghi789front.jpg",
        backImage: "https://i.imgur.com/ghi789back.jpg",
    },
    {
        fullName: "Phạm Thị D",
        email: "renter.d@example.com",
        password: "123456",
        address: "321 Trần Phú, Nha Trang",
        dateOfBirth: "1992-03-25",
        identityNumber: "555666777888",
        frontImage: "https://i.imgur.com/jkl012front.jpg",
        backImage: "https://i.imgur.com/jkl012back.jpg",
    },
    {
        fullName: "Hoàng Văn E",
        email: "renter.e@example.com",
        password: "123456",
        address: "654 Hai Bà Trưng, Huế",
        dateOfBirth: "1997-07-30",
        identityNumber: "999888777666",
        frontImage: "https://i.imgur.com/mno345front.jpg",
        backImage: "https://i.imgur.com/mno345back.jpg",
    },
];

async function seedRenters() {
    await AppDataSource.initialize();

    const accountRepo = AppDataSource.getRepository("Account");
    const renterRepo = AppDataSource.getRepository("Renter");

    for (const r of renters) {
        const hash = await bcrypt.hash(r.password, 10);

        const accountId = uuidv4();
        const renterId = uuidv4();

        // Tạo Account
        const account = accountRepo.create({
            AccountID: accountId,
            Email: r.email,
            PasswordHash: hash,
            FullName: r.fullName,
            Role: "Renter",
            Status: "Active",
        });
        await accountRepo.save(account);

        // Tạo Renter
        const renter = renterRepo.create({
            RenterID: renterId,
            AccountID: accountId,
            Address: r.address,
            DateOfBirth: r.dateOfBirth,
            IdentityNumber: r.identityNumber,
            FrontIdentityImageUrl: r.frontImage,
            BackIdentityImageUrl: r.backImage,
        });
        await renterRepo.save(renter);

        console.log(`Tạo renter: ${r.fullName} - ${r.email}`);
    }

    console.log("TẤT CẢ RENTER ĐÃ ĐƯỢC TẠO!");
    process.exit();
}

seedRenters().catch(console.error);