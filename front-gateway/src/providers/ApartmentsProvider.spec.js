'use strict';
import { stub } from 'sinon';
require('sinon-as-promised');
import ApartmentsProvider from './ApartmentsProvider';

describe('ApartmentsProvider', function () {

  beforeAll(function () {
    this.mockApartments = [ 123, 456 ];
    this.apiProviderMock = {
      fetch: stub().resolves(this.mockApartments)
    };
    this.appStoreMock = {
      apartmentStore: {}
    };

    this.apartmentsProvider = new ApartmentsProvider(this.appStoreMock, this.apiProviderMock);
  });

  it('should call API to load apartments and save them to store', function () {
    return this.apartmentsProvider.loadApartments()
    .then(() => expect(this.appStoreMock.apartmentStore.apartments).toBe(this.mockApartments));
  });

});
