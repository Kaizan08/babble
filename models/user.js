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
  user.associate = function(models){
    user.hasMany(models.post, { as: "posts", foreignKey: "userId"});
    user.hasMany(models.like, {as: "likes", foreignKey: "authorid"})
  }
  return user;
};