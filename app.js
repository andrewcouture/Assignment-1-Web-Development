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
const DB = require('./config/db');
const User = require('./models/user')
const BusinessContact = require('./models/businessContacts')

const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//connects to mongoDB using the URI from our config file
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

//session management
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

//flash messages
app.use(flash());


// configures passport
app.use(passport.initialize());
app.use(passport.session());

// local strategy
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

const newUser = new User({
  username: 'andrewcouture',
  password: 'password',
  email: 'test@gmail.com',
});

User.register(newUser, newUser.password, function(err,user){
  if(err){console.log(err)  }
  else{
    //A new user was saved
    console.log(user + "1");
  }
})

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware or route handler
  } else {
    res.redirect('/login'); // User is not authenticated, redirect to the login page
  }
}

app.get('/secure/contacts', isAuthenticated, async function(req, res) {
  try {
    const BusinessContactsArray = await BusinessContact.find({}, 'contactName contactNumber email')
    res.render('pages/secure/contacts', { contacts: BusinessContactsArray })
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
  
});

// login page
app.get('/login', function(req, res) {
  res.render('pages/login', { message: req.flash('error') });
});

// Login form submit
app.post('/login', passport.authenticate('local', {
  successRedirect: '/secure/contacts',
  failureRedirect: '/login',
  failureFlash: true,
}));

//logout to terminate previous login session 
app.get('/logout', function (req, res) {
  req.logout(function(err) {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
    });
});

// updates the user at the contact id
app.get('/update/:id', isAuthenticated, async function(req, res) {
  try {
    const contactId = req.params.id;
    const contact = await BusinessContact.findById(contactId);
    if (!contact) {
      //if contact id isnt in the db then we want alert user
      return res.status(404).send('Contact not found');
    }
    res.render('pages/update', { contact: contact });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// submits the update and finds by the id to update
app.post('/update/:id', isAuthenticated, async function(req, res) {
  try {
    const contactId = req.params.id;
    const { contactName, contactNumber, email } = req.body;
    const updatedContact = await BusinessContact.findByIdAndUpdate(
      contactId,
      { contactName, contactNumber, email },
      { new: true }
    );
    if (!updatedContact) {
      //if contact id isnt in the db then we want alert user
      return res.status(404).send('Contact not found');
    }
    res.redirect('/secure/contacts');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// deletes contact at id
app.get('/delete/:d', isAuthenticated, async function(req, res) {
  try {
    const contactId = req.params.id;
    await BusinessContact.findByIdAndRemove(contactId);
    res.redirect('/secure/contacts');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});






