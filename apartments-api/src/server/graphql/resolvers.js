'use strict';
const cityRepository = require('../../apartmentsDb/repositories/cityRepository');
const neighborhoodRepository = require('../../apartmentsDb/repositories/neighborhoodRepository');

module.exports = {
  Query: {
    cities: cityRepository.list,
    neighborhoods: (_, { city_id }) => neighborhoodRepository.getByCityId(city_id)
  }
};
