'use strict';
describe('/health', function () {
  const ApiClient = require('./apiClient.js');
  const __ = require('hamjest');

  before(function* () {
    this.apiClient = yield ApiClient.init();
  });

  it('should check health for status', function* () {

    const getResponse = yield this.apiClient.getHealth().expect(200).end();
    const expected = 'OK';

    __.assertThat(getResponse.text, __.allOf(
      __.is(__.string()),
      __.containsString(expected)
    ));
  });
});
