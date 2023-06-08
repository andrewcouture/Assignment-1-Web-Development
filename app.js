/*
  styles.css
  Andrew Couture
  301243770 
  06/04/2023
*/


// adds the express module
var express = require('express');
var app = express();

// sets view engine to ejs
app.set('view engine', 'ejs');

// Starts the server and listens on the specified port or default to 5000
app.listen(process.env.PORT || 5000);

//sets static files from the public directory to have the public url
app.use('/public', express.static('public'));


// Define routes
//Takes requests for each url and render each view from the pages directory

// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

// projects page
app.get('/projects', function(req, res) {
  res.render('pages/projects');
});

//services page
app.get('/services', function(req, res) {
  res.render('pages/services');
});

//contact page
app.get('/contact', function(req, res) {
  res.render('pages/contact');
});
