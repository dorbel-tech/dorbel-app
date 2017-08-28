'use strict';
const nock = require('nock');
const faker = require('faker');
const __ = require('hamjest');
const _ = require('lodash');
const facebookProvider = require('../../../src/providers/facebookProvider');

describe('facebook provider', function () {

  afterEach(() => nock.cleanAll());

  describe('mutual friends', function () {
    const mockMutualFriendsCall = (user_id, access_token, response) => nock('https://graph.facebook.com')
      .get(`/v2.10/${user_id}`)
      .query({ access_token, fields: 'context.fields(all_mutual_friends.limit(5))' })
      .reply(200, response);

    it('should call facebook api with correct url and query', function * () {
      const user_id = faker.random.uuid();
      const access_token = faker.random.uuid();
      const apiCall = mockMutualFriendsCall(user_id, access_token);

      yield facebookProvider.getMutualFriends(access_token, user_id);

      apiCall.done(); // asserts call was made and caught by nock
    });

    it('Should map Facebook API response to friend details array and total_count', function * () {
      const user_id = faker.random.uuid();
      const access_token = faker.random.uuid();
      const total_count = faker.random.number();
      const expectedFriends = _.times(3, () => ({ name: faker.name.firstName() + ' ' + faker.name.lastName(), imageUrl: faker.internet.url() }));
      const mockResponse = {
        context: {
          all_mutual_friends: {
            data: expectedFriends.map(friend => ({
              name: friend.name,
              picture: { data: { url: friend.imageUrl } }
            })),
            summary: { total_count }
          }
        }
      };
      const apiCall = mockMutualFriendsCall(user_id, access_token, mockResponse);

      const mutualFriends = yield facebookProvider.getMutualFriends(access_token, user_id);

      apiCall.done(); // asserts call was made and caught by nock
      __.assertThat(mutualFriends.items, __.equalTo(expectedFriends));
      __.assertThat(mutualFriends.total_count, __.equalTo(total_count));
    });
  });
});
