'use strict';
const cityRepository = require('../../apartmentsDb/repositories/cityRepository');

function* get() {
  this.response.body = yield cityRepository.list();
}

module.exports = {
  get: get
};
