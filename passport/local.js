const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = function (passport) {

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id)
		.then(function (user) {
			done(null, user.dataValues);
		})
		.catch(err => {
			done(err);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function (req, email, password, done) {
		process.nextTick(function () {
			User.findOne({where: {email: email}})
			.then(function (user) {
				if (user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				} else {
					User.create({email, password})
					.then(function (response) {
						done(null, response.dataValues);
					})
					.catch(function (err) {
						throw(err);
					});
				}
			})
			.catch(function (err) {
				done(err);
			});
		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function (req, email, password, done) {
		process.nextTick(function () {
			User.findOne({where: {email: email}})
			.then(function (user) {
				if (user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				} else {
				}
			})
			.catch(function (err) {
				done(err);
			});
		});
	}));
};