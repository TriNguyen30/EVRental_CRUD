// models/Report.js
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Report",
    tableName: "Reports",
    columns: {
        ReportID: {
            type: "int", 
            primary: true,
            generated: "increment",
        },
        ReportType: {
            type: "enum",
            enum: ["Incident", "Renter", "Handover"],
            default: "Incident",
        },
        RenterID: { type: "char", length: 36, nullable: true },
        StaffID: { type: "char", length: 36 },
        VehicleID: { type: "char", length: 36, nullable: true },
        ReportDetails: { type: "text" },
        CreatedAt: { type: "datetime", createDate: true },
        ResolvedAt: { type: "datetime", nullable: true }, 
        Status: {
            type: "enum",
            enum: ["Open", "Closed", "Pending"],
            default: "Open",
        },
        IsHighRisk: { type: "boolean", default: false },
    },
    relations: {
        Renter: {
            type: "many-to-one",
            target: "Renter",
            joinColumn: { name: "RenterID" },
            onDelete: "SET NULL",
        },
        Staff: {
            type: "many-to-one",
            target: "Staff",
            joinColumn: { name: "StaffID" },
            onDelete: "RESTRICT",
        },
        Vehicle: {
            type: "many-to-one",
            target: "Vehicle",
            joinColumn: { name: "VehicleID" },
            onDelete: "SET NULL",
        },
    },
});