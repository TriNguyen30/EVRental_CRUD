// models/Account.js
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Account",
    tableName: "Account",
    columns: {
        AccountID: {
            type: "char",
            length: 36,
            primary: true,
        },
        Email: {
            type: "varchar",
            length: 100,
            unique: true,
        },
        PasswordHash: {
            type: "varchar",
            length: 255,
        },
        PhoneNumber: {
            type: "varchar",
            length: 20,
            nullable: true,
        },
        FullName: {
            type: "varchar",
            length: 100,
        },
        Role: {
            type: "enum",
            enum: ["Renter", "Staff", "Admin"],
            default: "Renter",
        },
        Status: {
            type: "enum",
            enum: ["Active", "Inactive", "Locked", "Pending"],
            default: "Pending",
        },
    },
});