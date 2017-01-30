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
        clearAndSet: spy()
      }
    };

    this.apartmentsProvider = new ApartmentsProvider(this.appStoreMock, this.providersMock);
  });

  it('should call API to load apartments and save them to store', function () {
    return this.apartmentsProvider.loadApartments()
      .then(() => expect(this.appStoreMock.listingStore.clearAndSet.args[0][0]).toBe(this.mockApartments));
  });

});
