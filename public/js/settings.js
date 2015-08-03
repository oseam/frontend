/*
 * Settings.js
 */

var settings = {};
var platform = {};
var gmaps = {};
var isLoggedIn;
var formError;

// Settings
settings.URL = 'http://localhost';
settings.PORT = '1337';

// Platform

// Check if user is logged in
if(localStorage.token !== null) {
  var isLoggedIn = true;
} else {
  var isLoggedIn = false;
}

// Google Maps Key
gmaps.key = ''; // Add Google Maps Key
