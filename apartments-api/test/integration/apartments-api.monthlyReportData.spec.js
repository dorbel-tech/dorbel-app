'use strict';
describe('Apartments API Likes service integration', function () {
  const ApiClient = require('./apiClient.js');
  const _ = require('lodash');
  const __ = require('hamjest');
  const faker = require('../shared/fakeObjectGenerator');
  const moment = require('moment');

  describe('monthlyReportData service integration', function () {
    function* createListings(listings, adminApiClient) {
      const listingKeys = _.keys(listings);

      // for loop is used in order to support yields
      for (let i = 0; i < listingKeys.length; i++) {
        const listing = listings[listingKeys[i]];
        let requestedStatus;
        if (listing.status != 'pending' && listing.status != 'rented') {
          requestedStatus = _.clone(listing.status);
          listing.status = 'pending';
        }

        const createListingResp = yield adminApiClient.createListing(listing).expect(201).end();
        listing.id = createListingResp.body.id;

        if (requestedStatus) {
          yield adminApiClient.patchListing(listing.id, { status: requestedStatus }).expect(200).end();
        }
      }
    }

    before(function* () {
      this.apiClient = yield ApiClient.getInstance();
      this.adminApiClient = yield ApiClient.getAdminInstance();
    });

    describe('GET /apartments/monthlyReportData', function () {
      it('should return rented listing that started on this day of the month and lease_end > 1/1/3000', function* () {
        const fakeReportDate = moment({ year: 3000, month: 0, date: 1 }); // 1/1/3000
        
        const basicSanitylistings = { // Nothing should be returned by the endpoint but 'today'
          today: faker.getFakeListing({
            status: 'rented',
            lease_start: faker.getDateString(fakeReportDate.clone()),
            lease_end: faker.getDateString(fakeReportDate.clone().add(1, 'year'))
          }),
          tomorrow: faker.getFakeListing({
            status: 'rented',
            lease_start: faker.getDateString(fakeReportDate.clone().add(1, 'day')),
            lease_end: faker.getDateString(fakeReportDate.clone().add(1, 'year'))
          }),
          yesterday: faker.getFakeListing({
            status: 'rented',
            lease_start: faker.getDateString(fakeReportDate.clone().add(-1, 'day')),
            lease_end: faker.getDateString((fakeReportDate.clone()).add(1, 'year'))
          }),
          expired: faker.getFakeListing({
            status: 'rented',
            lease_start: faker.getDateString(fakeReportDate.clone().add(-1, 'year')),
            lease_end: faker.getDateString((fakeReportDate.clone()))
          }),
          pending: faker.getFakeListing({
            status: 'pending',
            lease_start: faker.getDateString(fakeReportDate.clone()),
            lease_end: faker.getDateString(fakeReportDate.clone().add(1, 'year'))
          }),
          listed: faker.getFakeListing({
            status: 'listed',
            lease_start: faker.getDateString(fakeReportDate.clone()),
            lease_end: faker.getDateString(fakeReportDate.clone().add(1, 'year'))
          }),
          deleted: faker.getFakeListing({
            status: 'deleted',
            lease_start: faker.getDateString(fakeReportDate.clone()),
            lease_end: faker.getDateString((fakeReportDate.clone().add(1, 'year')))
          }),
        };

        yield createListings(basicSanitylistings, this.adminApiClient);
        const monthlyReportDataResp = yield this.adminApiClient
          .getMonthlyReportData(fakeReportDate.date(), fakeReportDate.month() + 1, fakeReportDate.year())
          .expect(200).end();

        const blacklistedListingIds = _.map(_.omit(basicSanitylistings, 'today'), 'id');

        __.assertThat(monthlyReportDataResp.body,
          __.hasItem(__.hasProperty('id', basicSanitylistings.today.id)),
          __.not(__.hasItems(__.hasProperty('id', ...blacklistedListingIds)))
        );
      });

      it('should return listings with higher lease_start day if its the last day of the month', function* () {
        const fakeReportDate = moment({ date: 28, month: 1, year: 3000 }); // 28/2/3000
        const listings = {
          shortMonth: faker.getFakeListing({
            status: 'rented',
            lease_start: faker.getDateString(fakeReportDate),
            lease_end: faker.getDateString(fakeReportDate.clone().add(1, 'year'))
          }),
          longMonth: faker.getFakeListing({
            status: 'rented',
            lease_start: faker.getDateString(moment({ date: 31, month: 0, year: 3000 })), // 31/1/3000
            lease_end: faker.getDateString(moment({ date: 31, month: 0, year: 3001 }))
          })
        };

        yield createListings(listings, this.adminApiClient);

        const { body: monthlyReportData } = yield this.adminApiClient
          .getMonthlyReportData(fakeReportDate.date(), fakeReportDate.month() + 1, fakeReportDate.year())
          .expect(200).end();

        const expectedListingIds = _.map(listings, 'id');
        __.assertThat(_.map(monthlyReportData, 'id'), __.hasItems(...expectedListingIds));
      });

      it('should return 403 for non admin user', function* () {
        yield this.apiClient.getMonthlyReportData(moment().date(), moment().month() + 1, moment().year())
          .expect(403).end();
      });
    });
  });
});
