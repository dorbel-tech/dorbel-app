'use strict';
import CityProvider from './CityProvider.js';

describe('City Provider', () => {
  let cityProvider;
  let appStoreMock;
  let apiMock;

  beforeAll(() => {
    apiMock = {
      gql: jest.fn()
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
    it('should call GQL api and save to store', () => {
      const mockCities = [ 6,5,4 ];
      apiMock.gql.mockReturnValue(Promise.resolve({ data: { cities: mockCities } }));

      return cityProvider.loadCities()
      .then(() => {
        expect(apiMock.gql).toHaveBeenCalled();
        expect(appStoreMock.cityStore.cities).toBe(mockCities);
      });
    });
  });
});
