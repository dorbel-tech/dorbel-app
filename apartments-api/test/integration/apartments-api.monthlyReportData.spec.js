'use strict';
describe('Apartments API Likes service integration', function () {
  const ApiClient = require('./apiClient.js');
  const _ = require('lodash');
  const __ = require('hamjest');
  const faker = require('../shared/fakeObjectGenerator');
  const moment = require('moment');

  describe('monthlyReportData service integration', function () {
    const fakeToday = moment({ year: 3000, month: 0, date: 1 }); // 1/1/3000

    // Nothing should be returned by the endpoint but 'today'
    const listings = {
      today: faker.getFakeListing({
        status: 'rented',
        lease_start: faker.getDateString(fakeToday.clone()),
        lease_end: faker.getDateString(fakeToday.clone().add(1, 'year'))
      }),
      tomorrow: faker.getFakeListing({
        status: 'rented',
        lease_start: faker.getDateString(fakeToday.clone().add(1, 'day')),
        lease_end: faker.getDateString(fakeToday.clone().add(1, 'year'))
      }),
      yesterday: faker.getFakeListing({
        status: 'rented',
        lease_start: faker.getDateString(fakeToday.clone().add(-1, 'day')),
        lease_end: faker.getDateString((fakeToday.clone()).add(1, 'year'))
      }),
      expired: faker.getFakeListing({
        status: 'rented',
        lease_start: faker.getDateString(fakeToday.clone().add(-1, 'year')),
        lease_end: faker.getDateString((fakeToday.clone()))
      }),
      pending: faker.getFakeListing({
        status: 'pending',
        lease_start: faker.getDateString(fakeToday.clone()),
        lease_end: faker.getDateString(fakeToday.clone().add(1, 'year'))
      }),
      listed: faker.getFakeListing({
        status: 'listed',
        lease_start: faker.getDateString(fakeToday.clone()),
        lease_end: faker.getDateString(fakeToday.clone().add(1, 'year'))
      }),
      deleted: faker.getFakeListing({
        status: 'deleted',
        lease_start: faker.getDateString(fakeToday.clone()),
        lease_end: faker.getDateString((fakeToday.clone().add(1, 'year')))
      }),
    };

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
      yield createListings(listings, this.adminApiClient);
    });

    describe('GET /apartments/monthlyReportData', function () {
      it('return a report for a rented listing that started today and lease_end > 1/1/3000', function* () {
        const monthlyReportDataResp = yield this.adminApiClient
          .getMonthlyReportData(fakeToday.date(), fakeToday.month() + 1, fakeToday.year())
          .expect(200).end();

        __.assertThat(monthlyReportDataResp.body,
          __.hasItem(__.hasProperty('id', listings.today.id)),
          __.not(__.hasItem(__.hasProperty('id', _.map(_.omit(listings, 'today'), 'id'))))
        );
      });

      it('should return 403 for non admin user', function* () {
        yield this.apiClient.getMonthlyReportData(fakeToday.date(), fakeToday.month() + 1, fakeToday.year())
          .expect(403).end();
      });
    });
  });
});
