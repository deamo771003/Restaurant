'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Favorite.belongsTo(models.Restaurant, { foreignKey: 'restaurantId' })
      Favorite.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Favorite.init({
    user_id: DataTypes.INTEGER,
    restaurant_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Favorite',
    tableName: 'Favorites',
    underscored: true
  });
  return Favorite;
};