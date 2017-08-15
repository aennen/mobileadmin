/**
 * Created by aennen on 8/15/2017.
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var apis = require('./routes/apis');

var https = require('https');
var http = require('http');
var HttpsProxyAgent = require('https-proxy-agent');

var app = express();

process.on('uncaughtException', function (e) {
    console.log("uncaughtException:" + e);
});

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
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

module.exports = app;

// Set up proxy agent =======================================
var proxyOptions = {
    host: 'genproxy',
    port: 8080
};

var proxyAgent = new HttpsProxyAgent(proxyOptions);


var options = {
    //host: 'amgate.itahs.com',
    hostname: 'www.google.com',
    //port: 443,
    //path: '/node/listactive?appcode=amgate&mode=json',
    method: 'GET',
    agent: proxyAgent
};

http.request(options, function (res) {

    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));

    res.setEncoding('utf8');

    res.on('data', function (chunk) {
        payload += chunk;
        console.log('ACTIVE-BODY: ' + chunk);
    });

    res.on('end', function () {
        console.log("END");
        callback(payload);
    })

}).end(function () {
    console.log("GET-ACTIVE-END");
});

app.listen(4000);
console.log('4000 is the magic port');

