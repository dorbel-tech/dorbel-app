'use strict';
const cityRepository = require('../../apartmentsDb/repositories/cityRepository');
const shared = require('dorbel-shared');
const ONE_DAY = 60 * 60 * 24;

async function get(ctx) {
  shared.helpers.headers.setCacheHeader(ctx.response, ONE_DAY);
  ctx.response.body = await cityRepository.list();
}

module.exports = {
  get: get
};
