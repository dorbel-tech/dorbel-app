'use strict';
import { stub, spy } from 'sinon';
require('sinon-as-promised');

import ApartmentsProvider from './ApartmentsProvider';

describe('ApartmentsProvider', () => {
  let apartmentsProvider;
  let appStoreMock;
  let mockApartments;
  let providersMock;

  beforeAll(() => {
    mockApartments = [123, 456];

    providersMock = {
      api: {
        fetch: stub().resolves(mockApartments)
      }
    };

    appStoreMock = {
      listingStore: {
        clearAndSet: spy()
      }
    };

    apartmentsProvider = new ApartmentsProvider(appStoreMock, providersMock);
  });

  it('should call API to load apartments and save them to store', () => {
    return apartmentsProvider.loadApartments()
      .then(() => expect(appStoreMock.listingStore.clearAndSet.args[0][0]).toBe(mockApartments));
  });
});
