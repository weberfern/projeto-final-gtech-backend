'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductOption.init({
    product_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    shape: DataTypes.STRING,
    radius: DataTypes.INTEGER,
    type: DataTypes.STRING,
    values: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductOption',
  });
  return ProductOption;
};