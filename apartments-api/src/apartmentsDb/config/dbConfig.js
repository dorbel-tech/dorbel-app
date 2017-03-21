// Main Sequelize CLI database configuration file.
// In use for Sequelize CLI seeds & migrations only - https://github.com/sequelize/cli
require('dotenv').config();
const dbConfig = {
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
  host: process.env.RDS_HOSTNAME,
  dialect: 'mysql'
};

module.exports = {
  development: dbConfig,
  test: dbConfig,
  ci: dbConfig,
  staging: dbConfig,
  production: dbConfig
};
