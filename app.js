var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require("reflect-metadata");
require("dotenv").config();

const { ensureJwtSecret } = require("./config/jwt.config");
const reportsRouter = require('./routes/reports');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const renterRouter = require('./routes/renters');
const bookingRouter = require('./routes/booking');
const profileRouter = require('./routes/profile');
const reportRouter = require('./routes/reports');
const { AppDataSource } = require("./config/database");

var app = express();

ensureJwtSecret();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/reports', reportsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/renters', renterRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/profile', profileRouter);
app.use('/api/reports', reportRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

AppDataSource.initialize()
  .then(() => console.log("Database connected"))
  .catch(err => console.error("DB Error:", err));

module.exports = app;

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
