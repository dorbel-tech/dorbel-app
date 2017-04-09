'use strict';
const neighborhoodRepository = require('../../apartmentsDb/repositories/neighborhoodRepository');
const shared = require('dorbel-shared');
const ONE_DAY = 60 * 60 * 24;

function* get() {
  shared.helpers.headers.setCacheHeader(this.response, ONE_DAY);  
  this.response.body = yield neighborhoodRepository.getByCityId(this.params.cityId);
}

module.exports = {
  get: get
};
