const config = require('dorbel-shared').config; config.setConfigFileFolder(__dirname);
const path = require('path');
const frontRoot = path.resolve(__dirname, '..', '..');

const dir = {
  src: path.resolve(frontRoot, 'src'),
  public: path.resolve(frontRoot, 'public')
};

module.exports = {
  get: config.get,
  dir
};
