var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home'});
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login'});
});

router.get('/admin', function(req, res, next) {
  res.render('admin', { title: 'Administration'});
});

router.get('/profile/:id', function(req, res, next) {
  res.render('profile', { title: 'Profile', id: req.params.id });
});

router.get('/bookings', function(req, res, next) {
  res.render('view-booking', { title: 'View Bookings', id: req.params.id });
});

router.get('/logout', function(req, res, next) {
  res.render('logout', { title: 'Logout'});
});

// Providers
router.get('/find-service', function(req, res, next) {
  res.render('find-service', { title: 'Find a Gardener'});
});


module.exports = router;
