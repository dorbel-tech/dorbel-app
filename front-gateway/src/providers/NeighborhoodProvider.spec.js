'use strict';
import NeighborhoodProvider from './NeighborhoodProvider.js';

describe('Neighborhood Provider', () => {
  let neighborhoodProvider;
  let appStoreMock;
  let apiMock;

  beforeAll(() => {
    apiMock = {
      gql: jest.fn().mockReturnValue(Promise.resolve())
    };
    appStoreMock = {
      neighborhoodStore: {
        neighborhoodsByCityId: {
          set: jest.fn()
        }
      }
    };

    neighborhoodProvider = new NeighborhoodProvider(appStoreMock, apiMock);
  });

  afterEach(() => jest.resetAllMocks());

  describe('Load neighborhoods', () => {
    it('should call gql endpoint and fill store only once', () => {
      const mockHoods = [ 4,5,6 ];
      const city_id = 7;
      apiMock.gql.mockReturnValue(Promise.resolve({ data : { neighborhoods: mockHoods }}));

      return neighborhoodProvider.loadNeighborhoodByCityId(city_id)
      .then(() => {
        expect(apiMock.gql).toHaveBeenCalled();
        expect(appStoreMock.neighborhoodStore.neighborhoodsByCityId.set).toHaveBeenCalledWith(city_id, mockHoods);
      });
    });
  });
});
