module.exports = {
	google: {
		clientID: '25203938042-4lib64qraacmrchg84igmhvvnira3h2h.apps.googleusercontent.com',
		clientSecret: 'lDIon8c4ETJzFRc2xB4ixHL-',
		callbackURL: 'http://localhost:8080/auth/google/callback',
		scope: ['profile', 'email']
	},
	facebook: {
		clientID: '1486674281419336',
		clientSecret: '12e07578bea996456597c6ead82b83e8',
		profileFields: ['id', 'emails', 'name'],
		callbackURL: 'http://localhost:8080/auth/facebook/callback',
		scope: ['email']
	}
};