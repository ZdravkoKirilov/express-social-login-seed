const User = require('../models/User');
const url = require('url');

module.exports = function (app, passport) {

	app.get('/auth/facebook', (req, res, next) => {
		const returnUrl = req.query.returnUrl || getReturnUrl('returnUrl=', req.headers.referer);
		passport.authenticate('facebook', {
			session: false,
			callbackURL: 'http://localhost:8080/auth/facebook/callback?returnUrl=' + returnUrl,
			scope: ['email']
		})(req, res, next);
	});

	app.get('/auth/facebook/callback', (req, res, next) => {
		const returnUrl = req.query.returnUrl;
		passport.authenticate('facebook', {
			callbackURL: 'http://localhost:8080/auth/facebook/callback?returnUrl=' + returnUrl,
			failureRedirect: '/'
		}, function (token) {
			// redirect back to front end with the token as url param
			debugger;
		})(req, res, next);
	});

	app.get('/auth/google', (req, res, next) => {
		const returnUrl = req.query.returnUrl || getReturnUrl('returnUrl=', req.headers.referer);
		req.session.returnUrl = returnUrl;
		const callbackURL = 'http://localhost:8080/auth/google/callback';
		debugger;
		passport.authenticate('google', {
			session: false,
			callbackURL,
			scope: ['profile', 'email']
		})(req, res, next);
	});

	app.get('/auth/google/callback', (req, res, next) => {
		const returnUrl = req.session.returnUrl;
		const callbackURL = 'http://localhost:8080/auth/google/callback';
		debugger;
		passport.authenticate('google', {
			callbackURL,
			failureRedirect: '/'
		}, function (token) {
			// redirect back to front end with the token as url param
			debugger;
		})(req, res, next);
	});

	app.post('/login', (req, res, next) => {
		const returnUrl = req.query.returnUrl;
		passport.authenticate('local-login', {}, function (token) {
			// redirect back to front end with the token as url param
			debugger;
		})(req, res, next);
	});

	app.post('/signup', async (req, res, next) => {
		const returnUrl = req.query.returnUrl || getReturnUrl('returnUrl=', req.headers.referer);
		const {email, password} = req.body;

		try {
			const result = await User.findOrCreate({
				where: {
					email
				},
				defaults: {
					email, password
				}
			});
			const user = result[0].dataValues;
			const isNew = result[1];
			if (isNew) {
				res.redirect(url.format({
					pathname: '/login',
					query: {
						returnUrl
					}
				}));
			} else {
				// should redirect to /login instead
				res.status(401).json({message: 'User already exists'});
			}
		} catch (err) {
			res.status(500).send('Internal server error');
		}
	});

	function getReturnUrl(paramName, returnUrl = '') {
		return returnUrl.substring(returnUrl.indexOf(paramName) + paramName.length, returnUrl.length);
	}
};