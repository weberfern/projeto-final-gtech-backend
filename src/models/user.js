'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstname: DataTypes.STRING,
    surname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true, // Isso impede e-mails duplicados no banco
      allowNull: false
    },
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
  });
  return User;
};