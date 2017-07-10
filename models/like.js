'use strict';
module.exports = function(sequelize, DataTypes) {
  var like = sequelize.define('like', {
    postid: DataTypes.INTEGER,
    authorid: DataTypes.INTEGER
  }, {
  });
  like.associate = function(models){
    like.belongsTo(models.post,{as: "post", foreignKey: "postid"});
    like.belongsTo(models.user,{as: "user", foreignKey: "id"});
  }
  return like;
};