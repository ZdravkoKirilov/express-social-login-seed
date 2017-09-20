const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const socialLogin = require('./configs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = passport => {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id);
			done(null, user.dataValues);
		} catch (err) {
			done(err);
		}
	});

	passport.use(new FacebookStrategy(socialLogin.facebook, (token, refreshToken, profile, done) => {
		process.nextTick(async function () {
			try {
				const email = profile.emails[0].value;
				const existingUser = await User.findOne({where: {email, provider: 'facebook'}});
				if (existingUser) {
					jwt.sign({user: existingUser.dataValues}, config.TOKEN_SECRET, function (err, token) {
						err ? done(null) : done(token);
					});
				} else {
					const newUser = await User.create({email, provider: 'facebook'});
					jwt.sign({user: newUser.dataValues}, config.TOKEN_SECRET, function (err, token) {
						err ? done(null) : done(token);
					});
				}
			} catch (err) {
				done(err);
			}
		});
	}));

	passport.use(new GoogleStrategy(socialLogin.google, (token, refreshToken, profile, done) => {
		process.nextTick(async function () {
			try {
				const email = profile.emails[0].value;
				const existingUser = await User.findOne({where: {email, provider: 'google'}});
				if (existingUser) {
					jwt.sign({user: existingUser.dataValues}, config.TOKEN_SECRET, function (err, token) {
						err ? done(null) : done(token);
					});
				} else {
					const newUser = await User.create({email, provider: 'google'});
					jwt.sign({user: newUser.dataValues}, config.TOKEN_SECRET, function (err, token) {
						err ? done(null) : done(token);
					});
				}
			} catch (err) {
				done(err);
			}
		});
	}));

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function (req, email, password, done) {
		process.nextTick(async function () {
			try {
				const existingUser = await User.findOne({where: {email, provider: 'local'}});
				if (existingUser) {
					done(null, false, req.flash('The username is already in use'));
				} else {
					const newUser = await User.create({email, password, provider: 'local'});
					done(newUser.dataValues);
				}
			} catch (err) {
				done(err);
			}
		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function (req, email, password, done) {
		process.nextTick(async function () {
			try {
				const user = await User.findOne({where: {email, password, provider: 'local'}});
				if (user) {
					jwt.sign({user: user.dataValues}, config.TOKEN_SECRET, function (err, token) {
						err ? done(null) : done(token);
					});
				} else {
					done(null, false, req.flash('Invalid username or password'));
				}
			} catch (err) {
				done(err);
			}
		});
	}));
};