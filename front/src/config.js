const config = require('dorbel-shared').config;
const path = require('path');

// load env file
config.setConfigFileFolder(__dirname + '/config');

const dir = {
  src: path.resolve(__dirname),
  views: path.resolve(__dirname, 'views'),
  public: path.resolve(__dirname, '..', 'public'),
  build: path.resolve(__dirname, '..', 'public', 'build'),
  static: path.resolve(__dirname, '..', 'public', 'static'),
};

module.exports = {
  get: config.get,
  dir
};
