'use strict';
/* The 'dataRetrieval' module is used to get data from the other API's in the system
*  This tests the integration between this module and the API's running
*/
const __ = require('hamjest');

// This is bull**** but until we have a CI-environment-seed it's the best I can do
const staticUser = {
  id: '96271bc9-6801-4ea5-8680-b3e29eafce0d',
  email: 'test@test.com'
};

describe('Data Retrieval Integration', function () {
  before(function* () {
    this.dataRetrieval = require('../../src/sender/dataRetrieval');
  });

  it('should get getListingInfo', function* () {
    const eventConfig = {
      dataRetrieval: ['getListingInfo']
    };
    const eventData = {
      user_uuid: staticUser.id,
      listing_id: 1
    };
    const results = yield this.dataRetrieval.getAdditonalData(eventConfig, eventData);

    __.assertThat(results.listing, __.hasProperties({ id: 1, publishing_user_email: staticUser.email }));
  });

});
