// config/database.js
require("reflect-metadata");
require("dotenv").config();
const { DataSource } = require("typeorm");

// Import tất cả EntitySchema
const Account = require("../models/Account");
const Renter = require("../models/Renter");
const Staff = require("../models/Staff");
const Vehicle = require("../models/Vehicle");
const Report = require("../models/Report");
const Booking = require("../models/Booking");
const DriverLicense = require("../models/DriverLicence");

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [Account, Renter, Staff, Vehicle, Report, Booking, DriverLicense],
    migrations: [],
    subscribers: [],
});

module.exports = { AppDataSource };