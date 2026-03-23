'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 1 Produto pertence a N categorias
      Product.belongsToMany(models.Category, {
        through: models.ProductCategory,
        foreignKey: 'product_id',
        otherKey: 'category_id',
        as: 'categories' // Apelido para aparecer na busca Postman
      });

      // 1 Produto tem N imagens
      Product.hasMany(models.ProductImage, {
        foreignKey: 'product_id',
        as: 'images'
      });

      // 1 Produto tem N opções
      Product.hasMany(models.ProductOption, {
        foreignKey: 'product_id',
        as: 'options'
      });
    }
  }
  Product.init({
    enabled: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    use_in_menu: DataTypes.BOOLEAN,
    stock: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    price_with_discount: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};