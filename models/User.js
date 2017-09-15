const config = require('../config.json');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('core', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
	storage: config.SQLITE_USERS_DB_PATH
});

sequelize
.authenticate()
.then(function () {
	console.log('Connection has been established successfully.');
})
.catch(function (err) {
	console.error('Unable to connect to the database:', err);
});

const User = sequelize.define('User', {
	email: Sequelize.STRING,
	password: Sequelize.STRING
}, {
	tableName: 'Users'
});

module.exports = User;