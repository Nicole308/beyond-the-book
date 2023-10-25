/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// For .env to work, we need this
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}


// Initialization of Frameworks
const express = require('express');
const app = express();
const path = require('path');

// Passport related Frameworks
require('express-validator');
require('connect-flash');
const session = require('express-session');
const passport = require('passport');

env = process.env.NODE_ENV || 'development';

var forceSsl = function (req, res, next) {
	if (req.headers['x-forwarded-proto'] !== 'https') {
		return res.redirect(['https://', req.get('Host'), req.url].join(''));
	}
	return next();
};

if (env === 'production') {
	app.use(forceSsl);
}

// Middleware
app.use(express.json()); // Setup server to accept JSON
app.use(express.urlencoded({ extended: false })); // Setup server to accept form data

/* ================PASSPORT RELATED==================== */

// Express Session Middleware
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
	res.locals.messages = require('express-messages')(req, res);
	next();
});

// Passport Config
require('./middleware/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
	res.locals.user = req.user || null,
	next();
});

/* ================END of PASSPORT RELATED==================== */

// Routes
const userRouter = require('./routes/users');
const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const res = require('express/lib/response');

app.get('/checking', (req, res) => {
	res.send('The server is working');
});

// Use route
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/books', booksRouter);
app.use(express.static(path.join((__dirname, 'public'))));

// Setup View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Page Not Found');
	err.status = 404;

	// Pass error to the next matching route.
	next(err);
});

// Error Handler
app.use(function (err, req, res, next) {
	res.status(err.status || 500);

	res.render('error', {
		message: err.message,
		error: err
	});
});


// Listen to Server
app.listen(process.env.PORT || 3000, () => {
	console.log(`Server started on http://localhost:${process.env.PORT || 3000}`);
});