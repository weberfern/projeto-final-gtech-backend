require('dotenv').config();

module.exports = {
  development: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // BANCO DE DADOS REAL
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  },
  test: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_TEST_NAME, // BANCO DE DADOS PARA TESTES
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  }
};
