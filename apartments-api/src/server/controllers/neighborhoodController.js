'use strict';
const neighborhoodRepository = require('../../apartmentsDb/repositories/neighborhoodRepository');
const shared = require('dorbel-shared');
const ONE_DAY = 60 * 60 * 24;

async function get(ctx) {
  shared.helpers.headers.setCacheHeader(ctx.response, ONE_DAY);
  ctx.response.body = await neighborhoodRepository.getByCityId(ctx.params.cityId);
}

module.exports = {
  get: get
};
