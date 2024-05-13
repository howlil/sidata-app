var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
const cors=require('cors');
var bodyParser = require('body-parser');
var server = require("./src/routes/index");



app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", server.auth)




app.use((req, res, next) => {
  console.log(req.body); 
  next();
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ success: false, message: 'Bad JSON' });
  }
  next();
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  } else {
    next(err);
  }
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json( { error: err });
});

app.use(function (err, req, res, next) {
  console.error(err.stack); 
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {}
  });
});


app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json('error', { error: err });
});
app.use((err, req, res, next) => {
  console.error(err); 
  res.status(err.status || 500);
  res.json({
    message: "An error occurred",
    error: err.message
  });
});
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (req, res, next) {
  res.status(404).json({ message: "Not Found" });
});

module.exports = app;
