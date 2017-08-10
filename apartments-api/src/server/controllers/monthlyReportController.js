'use strict';
const listingService = require('../../services/listingService');
const logger = require('dorbel-shared').logger.getLogger(module);

async function post(ctx) {
  logger.info('received a request for monthly report data');
  const { day, month, year } = ctx.request.body;
  ctx.response.body = await listingService.sendMonthlyReports(day, month, year, ctx.request.user);
  ctx.response.status = 200;
}

module.exports = {
  post
};
