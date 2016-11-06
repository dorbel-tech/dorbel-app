// Main Sequelize CLI database configuration file.
// In use for Sequelize CLI seeds & migrations only - https://github.com/sequelize/cli
module.exports = {
  "local": {
    "username": "dorbel",
    "password": "dorbel",
    "database": "dorbel",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "development": {
    "username": process.env.RDS_USERNAME,
    "password": process.env.RDS_PASSWORD,
    "database": process.env.RDS_DB_NAME,
    "host": process.env.RDS_HOSTNAME,
    "dialect": "mysql"
  },
  "development": {
    "username": process.env.RDS_USERNAME,
    "password": process.env.RDS_PASSWORD,
    "database": process.env.RDS_DB_NAME,
    "host": process.env.RDS_HOSTNAME,
    "dialect": "mysql"
  },
  "development": {
    "username": process.env.RDS_USERNAME,
    "password": process.env.RDS_PASSWORD,
    "database": process.env.RDS_DB_NAME,
    "host": process.env.RDS_HOSTNAME,
    "dialect": "mysql"
  },
};
