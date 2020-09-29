var createError = require("http-errors");
var express = require("express");
var path = require("path");

var logger = require("morgan");

const passport = require("passport");

const config = require("./config");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");



const waffleRouter = require("./routes/waffleRouter");
const uploadRouter = require("./routes/uploadRouter");

const mongoose = require("mongoose");

const url = config.mongoUrl;

const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  () => console.log("Connected correctly to server"),
  (err) => console.log(err)
);

var app = express();

// Secure traffic only
app.all("*", (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    console.log(
      `Redirecting to: https://${req.hostname}:${app.get("secPort")}${req.url}`
    );
    res.redirect(
      301,
      `https://${req.hostname}:${app.get("secPort")}${req.url}`
    );
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(express.static(path.join(__dirname, "public")));

app.use('/waffles', waffleRouter);
app.use("/imageUpload", uploadRouter);

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



// //

// const express = require('express');
// const morgan = require('morgan');
// const bodyParser = require('body-parser');
// const programRouter = require('./routes/waffleRouter');

// const hostname = 'localhost';
// const port = 3001;

// const app = express();
// app.use(morgan('dev'));
// app.use(bodyParser.json());

// app.use('/waffles', waffleRouter);

// // app.use(express.static(__dirname + '/public'));

// app.use((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html')
//     res.end('<html><body><h1>Hey! Glad you came by to order your yummy Babas Waffles take Out style!</h1></body></html>')
// });

// app.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`)
// })
