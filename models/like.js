'use strict';
module.exports = function(sequelize, DataTypes) {
  var like = sequelize.define('like', {
    postid: DataTypes.INTEGER,
    authorid: DataTypes.INTEGER
  }, {
  });
  like.associate = function(models){
    like.belongsTo(models.post,{foreignKey: "postId"});
    like.belongsTo(models.user,{foreignKey: "userId"});
  }
  return like;
};