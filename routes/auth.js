const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');
const url = require('url');

module.exports = function (app, passport) {
	// app.post('/signup', passport.authenticate('local-signup', {
	// 	// successRedirect: '/profile',
	// 	failureRedirect: '/login',
	// 	failureFlash: true
	// }), function (req, res, other, other1) {
	// 	debugger;
	// 	console.log('it really gets called');
	// });

	app.post('/signup', async (req, res, next) => {
		const returnUrl = getReturnUrl('returnUrl=', req.headers.referer);
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
				// const token = jwt.sign({user}, config.TOKEN_SECRET, {expiresIn: '24h'});
				// req.session.token = token;
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

	function getReturnUrl(paramName, returnUrl) {
		return returnUrl.substring(returnUrl.indexOf(paramName) + paramName.length, returnUrl.length);
	}

	// app.post('/signup', function (req, res, next) {
	// 	passport.authenticate('local-signup', function (err, user, info) {
	// 		debugger;
	// 		if (err) {
	// 			return next(err);
	// 		}
	// 		if (!user) {
	// 			return res.redirect('/login');
	// 		}
	// 		req.logIn(user, function (err) {
	// 			debugger;
	// 			if (err) {
	// 				return next(err);
	// 			}
	// 			return res.redirect('/users/' + user.username);
	// 		});
	// 	})(req, res, next);
	// });
};