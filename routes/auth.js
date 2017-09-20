const User = require('../models/User');
const url = require('url');

module.exports = function (app, passport) {

	app.get('/auth/facebook', (req, res, next) => {
		const returnUrl = req.query.returnUrl || getReturnUrl('returnUrl=', req.headers.referer) || '/profile';
		req.session.returnUrl = returnUrl;
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
		const returnUrl = req.query.returnUrl || getReturnUrl('returnUrl=', req.headers.referer) || '/profile';
		req.session.returnUrl = returnUrl;
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
		const returnUrl = req.query.returnUrl || getReturnUrl('returnUrl=', req.headers.referer) || '/profile';
		passport.authenticate('local-login', {}, function (token) {
			res.redirect(url.format({
				pathname: decodeURI(returnUrl),
				query: {
					token
				}
			}));
		})(req, res, next);
	});

	app.post('/signup', async (req, res, next) => {
		const returnUrl = req.query.returnUrl || getReturnUrl('returnUrl=', req.headers.referer) || '/profile';
		passport.authenticate('local-signup', {}, function (newUser) {
			if (newUser) {
				res.redirect(url.format({
					pathname: '/login',
					query: {
						returnUrl
					}
				}));
			}
		})(req, res, next);
	});

	function getReturnUrl(paramName, returnUrl = '') {
		return returnUrl.substring(returnUrl.indexOf(paramName) + paramName.length, returnUrl.length);
	}
};