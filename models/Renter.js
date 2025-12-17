// models/Renter.js
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Renter",
    tableName: "Renter",
    columns: {
        RenterID: {
            type: "char",
            length: 36,
            primary: true,
            // BỎ default: () => "UUID()"
            // Nếu bạn dùng ID cố định → KHÔNG cần default
            // Nếu muốn UUID → dùng: generated: "uuid"
        },
        AccountID: {
            type: "char",
            length: 36,
            // BỎ unique: true → không cần thiết
        },
        Address: { type: "varchar", length: 255, nullable: true },
        DateOfBirth: { type: "date", nullable: true },
        IdentityNumber: { type: "varchar", length: 20, nullable: true },
        FrontIdentityImageUrl: { type: "varchar", length: 255, nullable: true },
        BackIdentityImageUrl: { type: "varchar", length: 255, nullable: true },
    },
    relations: {
        Account: {
            type: "many-to-one",
            target: "Account",
            joinColumn: { name: "AccountID" },
            onDelete: "CASCADE",
        },
    },
});