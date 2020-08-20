var express     = require("express"),
    app         = express(),
    // axios    = require('axios'),
	passport	= require("passport"),
    bodyParser  = require('body-parser'),
	mongoose    = require('mongoose'),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect('mongodb://localhost:27017/auth_demo', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => {
	console.log("||      Connected to DB!       ||");
	console.log("=================================");
	console.log("");
})
.catch(error => console.log(error.message));

app.use(require("express-session")({
	secret: "Alexander Liu Is Cool",
	resave: false,
	saveUninitialized: false
}));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(passport.initialize());
app.use(passport.session());

var User = require("./models/user");
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ==============================================================================
app.get("/", function(req, res) {
	res.render("home.ejs");
});

app.get("/secret", isLoggedIn, function(req, res) {
	res.render("secret.ejs");
});

app.get("/register", function(req, res) {
	res.render("register.ejs");
});

app.post("/register", function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	User.register(new User({username: username}), password, function(err, user) {
		if (err) {
			console.log(err);
			res.render("register.ejs");
		} 
		else {
			passport.authenticate("local")(req, res, function() {
				res.redirect("/secret");
			});
		}
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect("/login");
}

app.get("/login", function(req, res) {
	res.render("login.ejs");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/secret",
	failureRedirect: "/login"
}), function(req, res) {
	
});

app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});





// ==============================================================================
app.get("*", function(req, res) {
	res.send("NOT FOUND 404");
});

app.listen(3000, function() { 
	console.log("");
	console.log("=================================");
  	console.log("||      Auth Demo Started      ||"); 
});


