const config = require('dorbel-shared').config;
const path = require('path');

config.setConfigFileFolder(__dirname);

const frontRoot = path.resolve(__dirname, '..', '..');

const dir = {
  src: path.resolve(frontRoot, 'src'),
  public: path.resolve(frontRoot, 'public')
};

module.exports = {
  get: config.get,
  dir
};
