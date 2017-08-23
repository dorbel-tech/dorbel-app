'use strict';
import NeighborhoodProvider from './NeighborhoodProvider.js';

describe('Neighborhood Provider', () => {
  let neighborhoodProvider;
  let appStoreMock;
  let apiMock;

  beforeAll(() => {
    apiMock = {
      gql: jest.fn()
    };
    appStoreMock = {
      neighborhoodStore: {
        neighborhoodsByCityId: {
          set: jest.fn(),
        }
      }
    };

    neighborhoodProvider = new NeighborhoodProvider(appStoreMock, apiMock);
  });

  afterEach(() => jest.resetAllMocks());

  describe('Load neighborhoods', () => {
    it('should call GQL api with city parameter and store values in store', () => {
      const city_id = 3;
      const mockNeighborhoods = [ 1,2,3 ];
      apiMock.gql.mockReturnValue(Promise.resolve({ data: { neighborhoods: mockNeighborhoods } }));

      return neighborhoodProvider.loadNeighborhoodByCityId(city_id)
      .then(() => {
        expect(apiMock.gql.mock.calls[0][1]).toHaveProperty('variables', { city_id });
        expect(appStoreMock.neighborhoodStore.neighborhoodsByCityId.set).toHaveBeenCalledWith(city_id, mockNeighborhoods);
      });
    });
  });
});
