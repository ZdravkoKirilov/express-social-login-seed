const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
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

	passport.use(new GoogleStrategy({
		clientID: '25203938042-4lib64qraacmrchg84igmhvvnira3h2h.apps.googleusercontent.com',
		clientSecret: 'lDIon8c4ETJzFRc2xB4ixHL-'
	}, (token, refreshToken, profile, done) => {
		// save user to db
		// const token = jwt.sign({user}, config.TOKEN_SECRET, {expiresIn: '24h'});
		debugger;
		done(token);
	}));

	passport.use(new FacebookStrategy({
		clientID: '1486674281419336',
		clientSecret: '12e07578bea996456597c6ead82b83e8'
	}, (token, refreshToken, profile, done) => {
		// save user to db
		// const token = jwt.sign({user}, config.TOKEN_SECRET, {expiresIn: '24h'});
		done(token);
	}));

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function (req, email, password, done) {
		process.nextTick(async function () {
			try {
				const user = await User.findOne({where: {email: email}});
				if (user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				} else {
					const newUser = await User.create({email, password});
					done(null, newUser.dataValues);
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
				const user = await User.findOne({where: {email: email}});
				if (user) {
					// const token = jwt.sign({user}, config.TOKEN_SECRET, {expiresIn: '24h'});
					done(null, user.dataValues);
				} else {
					done(null, false, req.flash('Invalid username'));
				}
			} catch (err) {
				done(err);
			}
		});
	}));
};