'use strict';
import { stub, spy } from 'sinon';
require('sinon-as-promised');
import listingsProvider from './listingsProvider';

describe('listingsProvider', function () {

  beforeAll(function () {
    this.mockApartments = [ 123, 456 ];
    this.apiProviderMock = {
      fetch: stub().resolves(this.mockApartments)
    };
    this.appStoreMock = {
      listingStore: {
        add: spy()
      }
    };

    this.listingsProvider = new listingsProvider(this.appStoreMock, this.apiProviderMock);
  });

  it('should call API to load apartments and save them to store', function () {
    return this.listingsProvider.loadApartments()
    .then(() => expect(this.appStoreMock.listingStore.add.args[0][0]).toBe(this.mockApartments));
  });

});
