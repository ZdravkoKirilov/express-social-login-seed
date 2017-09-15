module.exports = {
	up: function (queryInterface, Sequelize) {
		return queryInterface.createTable('Users', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
			},
			email: {
				type: Sequelize.STRING
			},
			password: {
				type: Sequelize.STRING
			}
		})
	},
	down: function (queryInterface, Sequelize) {

	}
};