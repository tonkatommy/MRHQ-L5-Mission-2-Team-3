var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var getDiscountRouter = require("./routes/getDiscount");
var getDiscountRouter = require("./routes/getDiscount");
var getQuoteRouter = require("./routes/getQuote");
const getRiskRatingRouter = require("./routes/getRiskRating");
var carValueRouter = require("./routes/getValue");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", getDiscountRouter);
app.use("/getDiscount", getDiscountRouter);
app.use("/getQuote", getQuoteRouter);
app.use("/api/getRiskRating", getRiskRatingRouter);
app.use("/getValue", carValueRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
