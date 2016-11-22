// Main Sequelize CLI database configuration file.
// In use for Sequelize CLI seeds & migrations only - https://github.com/sequelize/cli

const shared = require('dorbel-shared');
const path = require('path');
const config = shared.config; config.setConfigFileFolder(path.join(__dirname, '/../../config')); // load config from file before anything else
const dbConfig = {
  username: config.get('RDS_USERNAME'),
  password: config.get('RDS_PASSWORD'),
  database: config.get('RDS_DB_NAME'),
  host: config.get('RDS_HOSTNAME'),
  dialect: 'mysql'
};

module.exports = {
  development: dbConfig,
  test: dbConfig,
  ci: dbConfig,
  staging: dbConfig,
  production: dbConfig
};
