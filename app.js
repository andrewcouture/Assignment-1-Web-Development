/*
  app.js
  Andrew Couture
  301243770 
  06/04/2023
*/

// Adds the required modules
var express = require('express');
var session = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');
var localStrategy = passportLocal.Strategy;
var flash = require('connect-flash');

const mongoose = require('mongoose');
const DB = require('./db');
const User = require('./models/user')

const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB.URI, { useNewUrlParser: true, useUnifiedTopology: true });

let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', () => {
  console.log('Connected to MongoDB...');
});


// sets view engine to ejs
app.set('view engine', 'ejs');

// Starts the server and listens on the specified port or default to 5000
app.listen(process.env.PORT || 5000);

// sets static files from the public directory to have the public url
app.use('/public', express.static('public'));

// Middleware for session management
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Middleware for flash messages
app.use(flash());


// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Define routes
// Takes requests for each URL and renders each view from the pages directory



// Index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

// About page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

// Projects page
app.get('/projects', function(req, res) {
  res.render('pages/projects');
});

// Services page
app.get('/services', function(req, res) {
  res.render('pages/services');
});

// Contact page
app.get('/contact', function(req, res) {
  res.render('pages/contact');
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware or route handler
  } else {
    res.redirect('/login'); // User is not authenticated, redirect to the login page
  }
}


const newUser = new User({
  username: 'coutureandrew',
  password: 'andrew1234',
  email: 'coutureandrew1@gmail.com',
});

newUser.save(function(err) {
  if (err) {
    console.error('Error saving user:', err);
  } else {
    console.log('User saved successfully!');
  }
});

app.get('/secure/contacts', isAuthenticated, function(req, res) {
  // Render the contacts page for authenticated users
  res.render('pages/secure/contacts', { contacts: users })
});

// login page
app.get('/login', function (req, res) {
  res.render('pages/login');
});

// Login form submit
app.post('/login', passport.authenticate('local', {
  successRedirect: '/secure/contacts',
  failureRedirect: '/login',
  failureFlash: true,
}));

//logout 
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});