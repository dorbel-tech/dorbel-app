'use strict';
/* The 'dataRetrieval' module is used to get data from the other API's in the system
*  This tests the integration between this module and the API's running
*/
const __ = require('hamjest');
const moment = require('moment');

// This is meh, but until we have a CI-environment-seed (or something) it's the best I can do
const fixtures = {
  staticUser: {
    id: '23821212-6191-4fda-b3e3-fdb8bf69a95d',
    email: 'test@test.com'
  },
  listing_id: 1,
  event_id: 1
};

describe('Data Retrieval Integration', function () {
  before(function* () {
    this.dataRetrieval = require('../../src/sender/dataRetrieval');

    this.retrieve = (funcName, eventData) => {
      return this.dataRetrieval.getAdditonalData({ dataRetrieval: [funcName] }, eventData);
    };
  });

  it('should get listing info', function* () {
    const listingInfo = yield this.retrieve('getListingInfo', {
      user_uuid: fixtures.staticUser.id,
      listing_id: fixtures.listing_id
    });

    __.assertThat(listingInfo.listing.id, __.is(__.defined()));
    __.assertThat(listingInfo.listing.apartment.building.city.city_name, __.is(__.defined()));
    __.assertThat(listingInfo.listing.apartment.building.street_name, __.is(__.defined()));
    __.assertThat(listingInfo.listing.apartment.building.house_number, __.is(__.defined()));
    __.assertThat(listingInfo.listing.apartment.apt_number, __.is(__.defined()));
    __.assertThat(listingInfo.listing.apartment.rooms, __.is(__.defined()));
    __.assertThat(listingInfo.listing.apartment.size, __.is(__.defined()));
    __.assertThat(listingInfo.listing.apartment.floor, __.is(__.defined()));
  });

  it('should get OHE Info', function* () {
    const oheInfo = yield this.retrieve('getOheInfo', {
      event_id: fixtures.event_id
    });

    __.assertThat(moment(oheInfo.ohe.start_time, moment.ISO_8601).isValid(), __.is(true));
    __.assertThat(moment(oheInfo.ohe.end_time, moment.ISO_8601).isValid(), __.is(true));
  });

  it('should get OHE info for landlord', function* () {
    const oheInfo = yield this.retrieve('getOheInfoForLandlord', {
      event_id: fixtures.event_id
    });

    __.assertThat(moment(oheInfo.ohe.start_time, moment.ISO_8601).isValid(), __.is(true));
    __.assertThat(moment(oheInfo.ohe.end_time, moment.ISO_8601).isValid(), __.is(true));
    __.assertThat(oheInfo.ohe.publishing_user_id, __.is(oheInfo.customRecipients[0]));
  });

  it('should get listing followers', function* () {
    const listingFollowers = yield this.retrieve('sendToListingFollowers', {
      listing_id: fixtures.listing_id
    });

    for (let i = 0; i < 10; i++) {
      if (i < 5) {
        __.assertThat(listingFollowers.customRecipients, __.hasItem('00000000-0000-0000-0000-00000000000' + i));
      }
      else {
        __.assertThat(listingFollowers.customRecipients, __.not(__.hasItem('00000000-0000-0000-0000-00000000000' + i)));
      }
    }
  });

  it('should get listing followers count', function* () {
    const followersCountRes = yield this.retrieve('getListingFollowersCount', {
      listing_id: fixtures.listing_id
    });
    __.assertThat(followersCountRes.followersCount, __.is(5));
    __.assertThat(followersCountRes.customRecipients, __.is([fixtures.staticUser.id]));
  });

  it('should get listing OHEs count', function* () {
    const getListingOhesCountRes = yield this.retrieve('getListingOhesCount', {
      listing_id: fixtures.listing_id
    });

    __.assertThat(getListingOhesCountRes.ohesCount, __.is(1));
  });

  it('should get OHE registered users', function* () {
    const OheUsers = yield this.retrieve('sendToOheRegisteredUsers', {
      event_id: fixtures.event_id
    });

    for (let i = 0; i < 10; i++) {
      if (i < 5) {
        __.assertThat(OheUsers.customRecipients, __.hasItem('00000000-0000-0000-0000-00000000000' + i));
      }
      else {
        __.assertThat(OheUsers.customRecipients, __.not(__.hasItem('00000000-0000-0000-0000-00000000000' + i)));
      }
    }
  });
});
