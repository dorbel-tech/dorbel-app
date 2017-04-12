'use strict';
describe('Apartments API Likes service integration', function () {
  const ApiClient = require('./apiClient.js');
  const _ = require('lodash');
  const __ = require('hamjest');
  const faker = require('../shared/fakeObjectGenerator');

  // Username = profile-test-user@dorbel.com
  // Password = 123456
  const INTEGRATION_TEST_USER_ID = '2257cbf9-2591-4e76-91d6-db01dcc36055';

  before(function* () {
    this.apiClient = yield ApiClient.init(faker.getFakeUser({
      id: INTEGRATION_TEST_USER_ID
    }));
  });

  describe('user-profile endpoint integration', function () {
    before(function* () {
      this.updateData = {
        section: 'main',
        data: {
          first_name: 'test',
          last_name: 'user',
          phone: '666666666',
          email: 'test@user.com'
        }
      };
    });

    describe('PATCH /user-profile', function () {
      it('should fail to update user profile when not logged in', function* () {
        const resp = yield this.apiClient.updateUserProfile(this.updateData, false).expect(401).end();

        __.assertThat(resp.text, __.is('Not Authorized'));
      });

      it('should fail to set a property which is not whitelisted in userProfileService', function* () {
        let clonedUserData = _.clone(this.updateData);
        clonedUserData.role = 'admin';
        const resp = yield this.apiClient.updateUserProfile(clonedUserData).expect(400).end();

        __.assertThat(resp.text, __.is('The update request contains an illegal, not white listed field!'));
      });

      it('should fail to set a required property with an empty string', function* () {
        let clonedUserData = _.clone(this.updateData);
        clonedUserData.first_name = '';
        const resp = yield this.apiClient.updateUserProfile(clonedUserData).expect(400).end();

        __.assertThat(resp.text, __.is('The update request doesn\'t contain a value for the \'first_name\' required field'));
      });

      it('should fail to set an illegal profile section', function* () {
        let clonedUserData = _.clone(this.updateData);
        clonedUserData.first_name = 'The update request doesn\'t contain a value for the \'first_name\' required field';
        const resp = yield this.apiClient.updateUserProfile(clonedUserData).expect(400).end();

        __.assertThat(resp.text, __.is('The update request was rejected because the supplied section is illegal'));
      });


      it('should successfuly update user profile', function* () {
        const resp = yield this.apiClient.updateUserProfile(this.updateData).expect(200).end();
        delete this.updateData.section;
        
        __.assertThat(resp.body.user_metadata, __.hasProperties(this.updateData));
      });

      it('should fail to update without a section defined', function* () {
        const resp = yield this.apiClient.updateUserProfile(this.updateData).expect(200).end();

        __.assertThat(resp.text, __.is('The update request was rejected because no section was defined'));
      });
    });
  });
});
