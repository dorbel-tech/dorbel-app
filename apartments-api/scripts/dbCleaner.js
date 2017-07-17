'use strict';
const co = require('co');
const utils = require('../test/integration/utils');

co(utils.cleanDb())
  .then(process.exit);

