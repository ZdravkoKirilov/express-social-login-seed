const express = require('express');
const router = express.Router();

module.exports = function (app, passport) {
	// app.post('/signup', passport.authenticate('local-signup', {
	// 	// successRedirect: '/profile',
	// 	failureRedirect: '/login',
	// 	failureFlash: true
	// }), function (req, res, other, other1) {
	// 	debugger;
	// 	console.log('it really gets called');
	// });
	app.post('/signup', function (req, res, next) {
		passport.authenticate('local-signup', function (err, user, info) {
			debugger;
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.redirect('/login');
			}
			req.logIn(user, function (err) {
				debugger;
				if (err) {
					return next(err);
				}
				return res.redirect('/users/' + user.username);
			});
		})(req, res, next);
	});
};