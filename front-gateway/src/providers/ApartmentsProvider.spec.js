'use strict';
import { stub, spy } from 'sinon';
require('sinon-as-promised');
import ApartmentsProvider from './ApartmentsProvider';

describe('ApartmentsProvider', function () {

  beforeAll(function () {
    this.mockApartments = [123, 456];
    this.providersMock = {
      api: {
        fetch: stub().resolves(this.mockApartments)
      }
    };
    this.appStoreMock = {
      listingStore: {
        add: spy(),
        listingsById: {clear: spy()}
      }
    };

    this.apartmentsProvider = new ApartmentsProvider(this.appStoreMock, this.providersMock);
  });

  it('should call API to load apartments and save them to store', function () {
    return this.apartmentsProvider.loadApartments()
      .then(() => expect(this.appStoreMock.listingStore.add.args[0][0]).toBe(this.mockApartments));
  });
});
