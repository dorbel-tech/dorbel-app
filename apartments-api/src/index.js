'use strict';
const shared = require('dorbel-shared');
shared.config.setConfigFileFolder(__dirname + '/config');

const server = require('./server/server');
server.listen();
