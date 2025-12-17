// models/Vehicle.js
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Vehicle",
    tableName: "Vehicle",
    columns: {
        VehicleID: {
            type: "char",
            length: 36,
            primary: true,
        },
        LicensePlate: {
            type: "varchar",
            length: 20,
            unique: true,
        },
        Model: {
            type: "varchar",
            length: 100,
        },
        Brand: {
            type: "varchar",
            length: 100,
        },
    },
});