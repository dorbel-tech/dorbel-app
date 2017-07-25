'use strict';
const ApiClient = require('./apiClient.js');
const __ = require('hamjest');

describe('Apartments API GraphQL integration', function () {

  before(function * () {
    this.apiClient = yield ApiClient.getInstance();
  });

  it('should get cities', function * () {
    const { body } = yield this.apiClient.gql(`
      query GetCities {
        cities {
          id
          city_name
          display_order
        }
      }
    `);

    __.assertThat(body.data.cities, __.hasSize(2));
  });

});
