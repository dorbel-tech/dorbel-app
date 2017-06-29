'use strict';
const listingService = require('../../services/listingService');
const logger = require('dorbel-shared').logger.getLogger(module);

function* get() {
  logger.info('received a request for monthly report data');
  const { day, month } = this.request.query;
  this.response.body = yield listingService.getMonthlyReportData(day, month, this.request.user);
  this.response.status = 200;
}

module.exports = {
  get: get
};
