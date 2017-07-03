'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fname: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      lname: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      password: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      username: {
        allowNull: false,
        type: Sequelize.TEXT,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};