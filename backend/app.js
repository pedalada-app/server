var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var passport = require('passport');
var passportConfig = require('./config/passport');
var db = require('./db/index');
var dbConfig = require('./config/db');
var dataDb = require('./fix-db/index');

db.init(dbConfig.userDatabaseUrl);
dataDb.init(dbConfig.dataDatabaseUrl);

passportConfig(passport);

var authMiddleware = require('./src/routes/auth_middleware');
var users = require('./src/routes/users');
var form = require('./src/routes/form');
var competition = require('./src/routes/competition');
var update = require('./src/routes/update');

var app = express();

app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// middleware to verify a token
app.use('/', authMiddleware);
app.use('/users', users);
app.use('/form', form);
app.use('/competition', competition);
app.use('/update', update);

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
		res.send();
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.send();
});


module.exports = app;
