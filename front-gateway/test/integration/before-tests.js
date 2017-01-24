process.env.NODE_ENV = 'test';
require('babel-polyfill');

// extend mocha to use co-routines
const mocha = require('mocha');
const coMocha = require('co-mocha');
coMocha(mocha);
