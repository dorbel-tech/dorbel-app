'use strict';
const listingService = require('../../services/listingService');
const logger = require('dorbel-shared').logger.getLogger(module);

function* post() {
  logger.info('received a request for monthly report data');
  const { day, month, year } = this.request.body;
  this.response.body = yield listingService.sendMonthlyReports(day, month, year, this.request.user);
  this.response.status = 200;
}

module.exports = {
  post
};
