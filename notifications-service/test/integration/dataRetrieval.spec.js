'use strict';
/* The 'dataRetrieval' module is used to get data from the other API's in the system
*  This tests the integration between this module and the API's running
*/
const __ = require('hamjest');
const moment = require('moment');

// This is meh, but until we have a CI-environment-seed (or something) it's the best I can do
const fixtures = {
  staticUser : {
    id: '96271bc9-6801-4ea5-8680-b3e29eafce0d',
    email: 'test@test.com'
  },
  listing_id: 1,
  event_id: 1
};

describe('Data Retrieval Integration', function () {
  before(function* () {
    this.dataRetrieval = require('../../src/sender/dataRetrieval');

    this.retrieve = (funcName, eventData) => {
      return this.dataRetrieval.getAdditonalData({ dataRetrieval: [ funcName ] }, eventData);
    };
  });

  it('should get-Listing-Info', function* () {
    const listingInfo = yield this.retrieve('getListingInfo', {
      user_uuid: fixtures.staticUser.id,
      listing_id: fixtures.listing_id
    });

    __.assertThat(listingInfo.listing, __.allOf(
      __.hasProperties({ id: fixtures.listing_id, publishing_user_email: fixtures.staticUser.email }),
      __.hasProperty('apartment', __.allOf(
        __.hasProperty('apt_number'),
        __.hasProperty('building', __.allOf(
          __.hasProperty('street_name'),
          __.hasProperty('house_number'),
          __.hasProperty('city', __.hasProperty('city_name')),
        ))
      ))
    ));
  });

  it('should get Ohe Info', function* () {
    const oheInfo = yield this.retrieve('getOheInfo', {
      event_id: fixtures.event_id
    });

    __.assertThat(moment(oheInfo.ohe.start_time, moment.ISO_8601).isValid(), __.is(true));
    __.assertThat(moment(oheInfo.ohe.end_time, moment.ISO_8601).isValid(), __.is(true));
  });

});
