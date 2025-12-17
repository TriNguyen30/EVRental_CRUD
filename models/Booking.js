// models/Booking.js
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Booking",
    tableName: "Booking",
    columns: {
        BookingID: {
            type: "char",
            length: 36,
            primary: true,
            generated: "uuid",
        },
        RenterID: { type: "char", length: 36 },
        VehicleID: { type: "char", length: 36 },
        StartTime: { type: "datetime" },
        EndTime: { type: "datetime" },
        DepositAmount: { type: "decimal", precision: 10, scale: 2, default: 0 },
        Status: {
            type: "enum",
            enum: ["Pending", "Confirmed", "Cancelled", "Expired", "Completed"],
            default: "Pending",
        },
        CreatedAt: { type: "datetime", createDate: true },
        CancelledAt: { type: "datetime", nullable: true },
    },
    relations: {
        Renter: {
            target: "Renter",
            type: "many-to-one",
            joinColumn: { name: "RenterID" },
            onDelete: "CASCADE",
        },
        Vehicle: {
            target: "Vehicle",
            type: "many-to-one",
            joinColumn: { name: "VehicleID" },
            onDelete: "RESTRICT",
        },
    },
});