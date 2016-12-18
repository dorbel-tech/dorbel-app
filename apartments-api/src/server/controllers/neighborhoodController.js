'use strict';
const neighborhoodRepository = require('../../apartmentsDb/repositories/neighborhoodRepository');

function* get() {
  this.response.body = yield neighborhoodRepository.getByCityId(this.params.cityId);
}

module.exports = {
  get: get
};
