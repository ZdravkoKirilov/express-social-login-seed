const User = require('../models/User');
const url = require('url');

module.exports = function (app, passport) {

	app.get('/auth/facebook', (req, res, next) => {
		req.session.returnUrl = req.query.returnUrl || getReturnUrl('returnUrl=', req.headers.referer) || '/profile';
		passport.authenticate('facebook', {})(req, res, next);
	});

	app.get('/auth/facebook/callback', (req, res, next) => {
		const returnUrl = req.session.returnUrl;
		passport.authenticate('facebook', {
			failureRedirect: '/'
		}, function (token) {
			res.redirect(url.format({
				pathname: decodeURI(returnUrl),
				query: {
					token
				}
			}));
		})(req, res, next);
	});

	app.get('/auth/google', (req, res, next) => {
		req.session.returnUrl = req.query.returnUrl || getReturnUrl('returnUrl=', req.headers.referer) || '/profile';
		passport.authenticate('google', {})(req, res, next);
	});

	app.get('/auth/google/callback', (req, res, next) => {
		const returnUrl = req.session.returnUrl;
		passport.authenticate('google', {
			failureRedirect: '/login?returnUrl=' + returnUrl
		}, function (token) {
			res.redirect(url.format({
				pathname: decodeURI(returnUrl),
				query: {
					token
				}
			}));
		})(req, res, next);
	});

	app.post('/login', (req, res, next) => {
		const returnUrl = req.query.returnUrl || req.session.returnUrl || getReturnUrl('returnUrl=', req.headers.referer) || '/profile';
		passport.authenticate('local-login', {}, function (token) {
			const redirectUrl = url.format({
				pathname: decodeURI(returnUrl),
				query: {
					token
				}
			});
			res.redirect(redirectUrl);
		})(req, res, next);
	});

	app.post('/signup', async (req, res, next) => {
		const returnUrl = req.query.returnUrl || req.session.returnUrl || getReturnUrl('returnUrl=', req.headers.referer) || '/profile';
		passport.authenticate('local-signup', {}, function (err, newUser) {
			req.session.returnUrl = returnUrl;
			if (newUser) {
				res.redirect('/login');
			} else {
				res.render('signup', {message: 'User already exists'});
			}
		})(req, res, next);
	});

	app.get('/api/authorize', (req, res, next) => {
		passport.authenticate('jwt', {}, function (err, user) {
			if (err) {
				res.status(401).json({message: `User '${user.email}' is not authorized`});
			} else if (!user) {
				res.status(401).json({message: `Invalid access token.`});
			}
			else {
				res.status(200).json({message: `User '${user.email}' is authorized`});
			}
		})(req, res, next);
	});

	function getReturnUrl(paramName, returnUrl = '') {
		return returnUrl.substring(returnUrl.indexOf(paramName) + paramName.length, returnUrl.length);
	}
};