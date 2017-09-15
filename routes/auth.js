const express = require('express');
const router = express.Router();

module.exports = function (app, passport) {
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));
};