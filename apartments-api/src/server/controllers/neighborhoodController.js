'use strict';
const neighborhoodRepository = require('../../apartmentsDb/repositories/neighborhoodRepository');
const ONE_DAY = 60 * 60 * 24;

function* get() {
  this.response.set('Cache-Control', 'public, max-age=' + ONE_DAY);
  this.response.body = yield neighborhoodRepository.getByCityId(this.params.cityId);
}

module.exports = {
  get: get
};
