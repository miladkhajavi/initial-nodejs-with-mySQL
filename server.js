var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require('cors')
var session = require("express-session");
const config = require("./config");
const Logger = require('./app/middleware/logger')
var apiRouter = require("./app/routes/api");
const passport = require("passport");
require("./app/passport/passport")(passport);

var app = express();

app.use(cors())
// header
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(Logger.daily)

app.use("/api", apiRouter);

app.listen(config.port || process.env.port || 3000, function () {
  console.log(` ****** running on :  port ${config.port} ******`);
});
module.exports = app;