'use strict';
const co = require('co');

function dbCleaner() {
  const utils = require('../test/integration/utils');
  co(utils.cleanDb());
}

module.exports = dbCleaner();

