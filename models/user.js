'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    fname: DataTypes.TEXT,
    lname: DataTypes.TEXT,
    password: DataTypes.TEXT,
    username: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return user;
};