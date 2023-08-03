var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var usersRouter = require('./routes/users');
var socket_io = require('socket.io');

var app = express();

var io = socket_io({ wsEngine: 'ws' });
app.io = io;

var indexRouter = require('./routes/index')(io);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/////////////////////////////////////////////////////////
// Middleware to set the initial value of 'loggedIn' cookie to 'false'
app.use((req, res, next) => {
  if (req.cookies.loggedIn === undefined) {
    res.cookie('loggedIn', 'false');
  }
  next();
});
/////////////////////////////////////////////////////////
app.use(express.static(path.join(__dirname, 'public')));


/////////////////

// Route to handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Implement your login logic here
  // Check the credentials against the backend or a user database
  // If the login is successful, set the loggedIn state to true
  var loginSuccessful = true; // Replace this with your actual login logic
  if (username === "user" && password === "pass") {
    loginSuccessful = true;
  } else {
    loginSuccessful = false;
  }
  if (loginSuccessful) {
    res.cookie('loggedIn', 'true');
    // Redirect to the home page (where the canvas is rendered)
    //res.render('index', { loggedIn: req.cookies.loggedIn === 'true', title: 'App' });
    //res.redirect('/');
    //res.json({ success: true });
    res.redirect(`/?username=${encodeURIComponent(username)}`);
  } else {
    res.cookie('loggedIn', 'false');
    res.redirect('/');
    //res.status(401).json({ error: 'Invalid credentials' });
  }
  // Redirect to the home page (where the canvas is rendered)
  res.redirect('/');
});

// Route to handle logout
app.post('/logout', (req, res) => {
  // Clear the 'loggedIn' cookie to log out the user
  res.clearCookie('loggedIn');
  // Redirect to the home page (where the canvas is rendered)
  res.redirect('/');
});

// Route to render the index.ejs template
app.get('/', (req, res) => {
  // Pass the 'loggedIn' value to the template during rendering
  res.render('index', { loggedIn: req.cookies.loggedIn === 'true', title: 'App' });
});


// ... Other code ...

//////////////////




app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
