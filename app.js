
/**
 * Module dependencies.
 */

//Required modules
var express = require('express');
var flash = require('connect-flash');
var captchagen = require('captchagen');
var http = require('http');
var path = require('path');
var passport = require('passport');

//Required vars
var db = require('./controllers/db');
var dbConfig = require('./models/dbConfig');

var app = express();

require('./controllers/passport')(passport)

// all environments
app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

app.configure(function(){
	// required for passport
	app.use(passport.initialize());
	app.use(express.logger('dev'));
	app.use(express.cookieParser('keyboard cat')); // read cookies (needed for auth)
	app.use(express.session({ secret: 'keyboard cat', key: 'sid', cookie: { secure: true }})); // session secret
	
	app.use(express.bodyParser());// get information from html forms

	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
	app.use(app.router);
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Connect to database
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'Database connection error: '));
conn.once('open', function(){
	console.log('Connected to database');
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Require all get/post methods
require('./routes/route')(app, passport, db, mongoose, captchagen);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});