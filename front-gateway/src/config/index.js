const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);

const path = require('path');

shared.config.setConfigFileFolder(__dirname);

const frontRoot = path.resolve(__dirname, '..', '..');

const dir = {
  src: path.resolve(frontRoot, 'src'),
  public: path.resolve(frontRoot, 'public')
};

logger.info({frontRoot, dir}, 'Debugging path');

module.exports = {
  get: shared.config.get,
  dir
};
