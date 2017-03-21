'use strict';
const cityRepository = require('../../apartmentsDb/repositories/cityRepository');
const ONE_DAY = 60 * 60 * 24;

function* get() {
  this.response.set('Cache-Control', 'public, max-age=' + ONE_DAY);
  this.response.body = yield cityRepository.list();
}

module.exports = {
  get: get
};
