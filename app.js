
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
//var user = require('./routes/user');
var post = require('./routes/post');
var read = require('./routes/read');
var http = require('http');
var path = require('path');
var db = require('./routes/db');
var passport = require('passport');
var flash = require('connect-flash');

require('./routes/passport')(passport)

var app = express();

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

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017:test');
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'Database connection error: '));
conn.once('open', function(){
	console.log('Connected to database');
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



app.get('/', function(req, res){
  res.render('index', {user : req.user});
});
app.get('/post', post.addPost);
//app.get('/users', user.list);
app.get('/view', read.getPosts);
app.post('/addPost', db.savePost(mongoose));
app.post('/randomposts', db.getRandomPosts(mongoose));
app.post('/latestPosts', db.getLatestPosts(mongoose));

//Authentication
app.get('/login', function(req, res){
	res.render('login', {message: req.flash('loginMsg')});
})
app.get('/register', function(req, res){
	res.render('register', {message: req.flash('registerMsg')});
})

app.post('/login', passport.authenticate('login', {
	successRedirect : '/', // redirect to the secure profile section
	failureRedirect : '/login', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));


app.post('/register', passport.authenticate('register', {
	successRedirect : '/', // redirect to the secure profile section
	failureRedirect : '/register', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	//res.redirect('/');
	return null;
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
