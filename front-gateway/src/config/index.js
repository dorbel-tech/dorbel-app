require('dotenv');
const path = require('path');
const frontRoot = path.resolve(__dirname, '..', '..');

const dir = {
  src: path.resolve(frontRoot, 'src'),
  public: path.resolve(frontRoot, 'public')
};

module.exports = {
  dir
};
