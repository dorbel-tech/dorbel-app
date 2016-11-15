'use strict';
const cityRepository = require('../../apartmentDb/repositories/cityRepository');

function* get() {
  this.response.body = yield cityRepository.list();
}

module.exports = {
  get: get
};
