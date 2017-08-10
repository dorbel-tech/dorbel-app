'use strict';
const shared = require('dorbel-shared');
const listingService = require('../../services/listingService');
const ONE_MINUTE = 60;

async function get(ctx) {
  const apartmentId = ctx.params.apartmentId;
  shared.helpers.headers.setUserConditionalCacheHeader(ctx.request, ctx.response, ONE_MINUTE);

  ctx.response.body = await listingService.getByApartmentId(apartmentId, ctx.request.user);
}

module.exports = {
  get: get
};
