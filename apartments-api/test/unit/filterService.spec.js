'use strict';
const mockRequire = require('mock-require');
const __ = require('hamjest');
var sinon = require('sinon');

describe('Filters Service', function () {

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
    this.user = { id: this.mockFilter.dorbel_user_id };
    mockRequire('../../src/apartmentsDb/repositories/filterRepository', this.filterRepositoryMock);
    this.filterService = mockRequire.reRequire('../../src/services/filterService');
  });

  after(() => mockRequire.stopAll());

  describe('create', function () {
    it('should set email_notification:true based on existing filters', async function () {
      const filterToCreate = {};
      this.mockFilter.email_notification = true;

      const newFilter = await this.filterService.create(filterToCreate, this.user);

      __.assertThat(newFilter, __.hasProperty('email_notification', true));
    });

    it('should set email_notification:false based on existing filters', async function () {
      const filterToCreate = {};
      this.mockFilter.email_notification = false;

      const newFilter = await this.filterService.create(filterToCreate, this.user);

      __.assertThat(newFilter, __.hasProperty('email_notification', false));
    });
  });

  describe('update', function () {
    it('should not include email_notification in fields to update', async function () {
      const update = Object.assign({ city: 1 }, this.mockFilter);
      await this.filterService.update(this.mockFilter.id, update, this.user);
      __.assertThat(this.mockFilter.update.args[0][1].fields, __.not(__.contains('email_notification')));
    });
  });

});
