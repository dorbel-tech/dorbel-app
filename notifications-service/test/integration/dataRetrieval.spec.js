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

const REGISTERED_USERS = ['9212ce50-bc25-4737-afc7-74207b9ebadb', '9a3a66cb-143b-444f-a153-025ffd4db4ed'];

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

  it('should get listing likes', function* () {
    const listingLikes = yield this.retrieve('sendToListingLikedUsers', {
      listing_id: fixtures.listing_id
    });

    __.assertThat(listingLikes.customRecipients, __.is(REGISTERED_USERS));
  });

  it('should get listing likes count', function* () {
    const likersCountRes = yield this.retrieve('getListingLikesCount', {
      listing_id: fixtures.listing_id
    });

    __.assertThat(likersCountRes.followersCount, __.is(2));
    __.assertThat(likersCountRes.customRecipients, __.is([fixtures.staticUser.id]));
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

    __.assertThat(OheUsers.customRecipients, __.is(REGISTERED_USERS));
  });

  it('should get user details', function* () {
    const userDetails = yield this.retrieve('getUserDetails', {
      user_uuid: fixtures.staticUser.id
    });

    __.assertThat(userDetails.user_profile, __.is(__.defined()));
    __.assertThat(userDetails.user_profile.email, __.is(__.defined()));
  });
});

