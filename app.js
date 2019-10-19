var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const common = require('./config/common');
const nodeProcess = require('./services/nodeProcess');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var mqttClient = require('./routes/mqtt');
var testRouter = require('./routes/test');
var cronRouter = require('./services/cron');

// app.use('/', indexRouter);
app.use('/test', testRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.use((err, req, res, next) => {
    console.log(err);
    return res.json({'status':-1, 'result':err.stack})
});
global.updating = false;


//启动获取程序版本
common.console("Application Name : " + common.getName());
common.console("Version Info : " + common.getVersion());

module.exports = app;
