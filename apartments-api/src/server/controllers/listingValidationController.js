'use strict';
const listingService = require('../../services/listingService');

async function post(ctx) {
  let apartment = ctx.request.body.apartment;
  ctx.response.body = await listingService.getValidationData(apartment, ctx.request.user);
}

module.exports = {
  post
};
