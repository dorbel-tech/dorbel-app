process.env.NODE_ENV = 'test';

// extend mocha to use co-routines
const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha);

// extend sinon to support promises
require('sinon');
require('sinon-as-promised');
