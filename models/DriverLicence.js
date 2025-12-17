const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "DriverLicense",
    tableName: "DriverLicense",
    columns: {
        LicenseID: {
            type: "bigint",
            primary: true,
            generated: true,
        },
        RenterID: {
            type: "char",
            length: 36,
            nullable: false,
        },
        LicenseNumber: {
            type: "varchar",
            length: 50,
            nullable: false,
            unique: true,
        },
        IssuedDate: {
            type: "date",
            nullable: false,
        },
        ExpiryDate: {
            type: "date",
            nullable: false,
        },
        LicenseType: {
            type: "enum",
            enum: ["Car", "Motorcycle"],
            nullable: false,
        },
        LicenseImageUrl: {
            type: "varchar",
            length: 250,
            nullable: true,
        },
        IssuedBy: {
            type: "varchar",
            length: 120,
            nullable: true,
        },
        VerifiedStatus: {
            type: "enum",
            enum: ["Pending", "Verified", "Rejected"],
            default: "Pending",
        },
        VerifiedAt: {
            type: "datetime",
            nullable: true,
        }
    }
});
