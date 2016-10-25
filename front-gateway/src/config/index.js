const shared = require('dorbel-shared');
const path = require('path');

shared.config.setConfigFileFolder(__dirname);

const frontRoot = path.resolve(__dirname, '..', '..');

const dir = {
  src: path.resolve(frontRoot, 'src'),
  public: path.resolve(frontRoot, 'public')
};

module.exports = {
  get: shared.config.get,
  dir
};
