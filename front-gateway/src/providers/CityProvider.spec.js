'use strict';
import CityProvider from './CityProvider.js';

describe('City Provider', () => {
  let cityProvider;
  let appStoreMock;
  let apiMock;

  beforeAll(() => {
    apiMock = {
      fetch: jest.fn().mockReturnValue(Promise.resolve())
    };
    appStoreMock = {
      cityStore: {
        cities: []
      }
    };

    cityProvider = new CityProvider(appStoreMock, apiMock);
  });

  afterEach(() => jest.resetAllMocks());

  describe('Load cities', () => {
    it('should call api only once', () => {
      return Promise.all([cityProvider.loadCities(), cityProvider.loadCities()])
        .then(() => expect(apiMock.fetch).toHaveBeenCalledTimes(1));
    });
  });
});
