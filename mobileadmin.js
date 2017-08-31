var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./../../../../Users/aennen/Desktop/Innovations/Projects/Mobile Development/mobileadmin/routes/index');
var users = require('./../../../../Users/aennen/Desktop/Innovations/Projects/Mobile Development/mobileadmin/routes/users');
var apis = require('./../../../../Users/aennen/Desktop/Innovations/Projects/Mobile Development/mobileadmin/routes/apis');
var email = require('./../../../../Users/aennen/Desktop/Innovations/Projects/Mobile Development/mobileadmin/routes/mailer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, './views/pages'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


process.on('uncaughtException', function (err) {
    console.log('Whoops there is an uncaught error ' + err.stack);
});

module.exports = app;

app.listen(4000);
console.log('4000 is the magic port');