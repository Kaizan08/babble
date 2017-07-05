'use strict';
module.exports = function(sequelize, DataTypes) {
  var post = sequelize.define('post', {
    babble: DataTypes.TEXT,
    allowNull: false
  }, 
   {}
  );

  post.associate = function(models){
    post.belongsTo(models.user,{foreignKey: 'userId'});
  }
  return post;
};