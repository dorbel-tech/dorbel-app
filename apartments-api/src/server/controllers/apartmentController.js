'use strict';
const apartmentRepository = require('../../apartmentDb/repositories/apartmentRepository');

function* get() {
  this.response.body = yield apartmentRepository.list();
}

module.exports = {
  get: get
};
