'use strict';
describe('Apartments API Likes service integration', function () {
  const ApiClient = require('./apiClient.js');
  const moment = require('moment');

  describe('Apartments API sendMonthlyReport service integration', function () {
    before(function* () {
      this.apiClient = yield ApiClient.getInstance();
      this.adminApiClient = yield ApiClient.getAdminInstance();
    });

    describe('GET /apartments/monthlyReportData', function () {
      it('should return 403 for non admin user', function* () {
        yield this.apiClient.sendMonthlyReport(moment().date(), moment().month() + 1, moment().year())
          .expect(403).end();
      });

      it('should return 200 for an admin', function* () {
        yield this.adminApiClient.sendMonthlyReport(moment().date(), moment().month() + 1, moment().year())
          .expect(200).end();
      });
    });
  });
});
