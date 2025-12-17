// models/Staff.js
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Staff",
    tableName: "Staff",
    columns: {
        StaffID: { type: "char", length: 36, primary: true },
        AccountID: { type: "char", length: 36, unique: true },
    },
    relations: {
        Account: {
            type: "one-to-one",
            target: "Account",
            joinColumn: { name: "AccountID" },
        },
    },
});