'use strict';
const cityRepository = require('../../apartmentsDb/repositories/cityRepository');
const shared = require('dorbel-shared');
const ONE_DAY = 60 * 60 * 24;

function* get() {
  shared.helpers.headers.setCacheHeader(this.response, ONE_DAY);  
  this.response.body = yield cityRepository.list();
}

module.exports = {
  get: get
};
