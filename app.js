var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//===============MONGODB=================
var mongoose = require('mongoose');
global.db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // Create your schemas and models here.
});

mongoose.connect('mongodb://localhost/alerting');


//===============CREATE ROOT PATH=================

global.appRoot = path.resolve(__dirname);

//===============CREATE APP=================

var app = express();
module.exports = app;
//===============CONF APP=================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(appRoot + '/bower_components'));


//===============PASSPORT=================
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

//===============ROUTES=================

//var routes = require(appRoot + '/routes/routes')(app, passport);
var login = require('./routes/login');
var webapp = require('./routes/web-app');
var apiOrganizations = require('./routes/api_organizations');
var apiAlarms = require('./routes/api_alarms');
var apiXapis = require('./routes/api_xapis');
var apiUsers = require('./routes/api_users');
var apiOauth = require('./routes/api_oauth');
//var api = require('./routes/api');


app.use('/web-app/', webapp);
//app.use('/api/', api);

app.use('/api/organizations', apiOrganizations);
app.use('/api/alarms', apiAlarms);
app.use('/api/xapis', apiXapis);
app.use('/api/users', apiUsers);
app.use('/oauth', apiOauth);

app.use('/', login);

app.get('*', function (req, res) {
    res.redirect('/web-app/');
});
//===============ERRORS=================

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//===============INIT DB=================
var User = require(appRoot + "/bin/models/users");
var Password = require(appRoot + "/bin/models/passwords");

User.findOne({email: "admin@loc.al"}, function (err, user) {
    if (err) console.log(err);
    else if (user) console.log("user already exists");
    else User({
            email: "admin@loc.al",
            enabled: true,
            fullAccess: true,
            writeAccess: true
        }).save(function (err, user) {
            if (err) console.log(err);
            else Password({user: user, password: 'aerohive'}).save(function(err){
                if (err) console.log(err);
            })
        });
});
