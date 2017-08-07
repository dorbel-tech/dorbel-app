'use strict';
const documentService = require('../../services/documentService');

async function get(ctx) {
  if (ctx.request.query.listing_id) {
    const listing_id = parseInt(ctx.request.query.listing_id);
    ctx.response.body = await documentService.getByListingId(listing_id, ctx.request.user);
  } else {
    ctx.response.body = await documentService.getByUser(ctx.request.user);
  }
  ctx.response.status = 200;
}

async function destroy(ctx) {
  const document_id = parseInt(ctx.params.document_id);
  await documentService.destroy(document_id, ctx.request.user);
  ctx.response.status = 204;
}

async function post(ctx) {
  ctx.response.body = await documentService.create(ctx.request.body, ctx.request.user);
  ctx.response.status = 201;
}

module.exports = {
  get: get,
  post: post,
  delete: destroy
};
