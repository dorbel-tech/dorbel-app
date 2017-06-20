'use strict';
const mockRequire = require('mock-require');
const __ = require('hamjest');
var sinon = require('sinon');

describe.only('Filters Service', function () {

  before(function () {
    this.mockFilter = {
      id: 1,
      dorbel_user_id: 'abc123',
      update: sinon.stub().resolves()
    };
    this.filterRepositoryMock = {
      getById: sinon.stub().resolves(this.mockFilter),
      getByUser: sinon.stub().resolves([ this.mockFilter ])
    };
    mockRequire('../../src/apartmentsDb/repositories/filterRepository', this.filterRepositoryMock);
    this.filterService = mockRequire.reRequire('../../src/services/filterService');
  });

  after(() => mockRequire.stopAll());

  describe('update', function () {
    it('should send email_notification false if not specified', function * () {
      const update = Object.assign({ city: 1 }, this.mockFilter);
      yield this.filterService.update(this.mockFilter.id, update, { id: this.mockFilter.dorbel_user_id });
      __.assertThat(this.mockFilter.update.args[0][0], __.hasProperty('email_notification', false));
    });
  });

});
