'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Followship.belongsTo(models.User, {
        foreignKey: 'follower_id',
        as: 'follower'
      });
      Followship.belongsTo(models.User, {
        foreignKey: 'following_id',
        as: 'following'
      });
    }
  }
  Followship.init({
    follower_id: DataTypes.INTEGER,
    following_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followships',
    underscored: true
  });
  return Followship;
};