var currUser = null;

module.exports = function(app, passport, db, mongoose, captchagen){

	app.get('/', function(req, res){
		console.log(currUser+"\n");
		res.render('index', {user : currUser});
	});

	app.get('/post', function(req, res){
		var captcha = captchagen.create();
		captcha.generate();
		var text = captcha.text();
		var buf = captcha.buffer('jpeg');
		buf = new Buffer(buf, 'binary').toString('base64');
		res.render('post', {user: currUser, img: buf, text: text});
	});

	app.get('/view', function(req, res){
		res.render('view', {user: currUser});
	});

	app.get('/donate', function(req, res){
		res.render('donate', {user: currUser});
	})

	app.get('/contact', function(req, res){
		var captcha = captchagen.create();
		captcha.generate();
		var text = captcha.text();
		var buf = captcha.buffer('jpeg');
		buf = new Buffer(buf, 'binary').toString('base64');
		res.render('contact', {user: currUser, img: buf, text: text})
	})

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
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}), function(req, res){
		currUser = req.user;
		res.redirect('/');
	});


	app.post('/register', passport.authenticate('register', {
			failureRedirect : '/register', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}), function(req, res){
		currUser = req.user;
		res.redirect('/');
	});

	app.get('/logout', function(req, res) {
		currUser = null;
		req.logout();
		res.redirect('/');
	});
}