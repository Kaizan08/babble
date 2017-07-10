'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      postid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "posts",
          key: "id"
        }
      },
      authorid: {
        type: Sequelize.INTEGER,
        allowNull:false, 
        references: {
          model: "users",
          key: "id"
        }
      }
      });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('likes');
  }
};