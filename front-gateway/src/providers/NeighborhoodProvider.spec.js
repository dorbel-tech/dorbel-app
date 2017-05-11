'use strict';
import NeighborhoodProvider from './NeighborhoodProvider.js';

describe('Neighborhood Provider', () => {
  let neighborhoodProvider;
  let appStoreMock;
  let apiMock;

  beforeAll(() => {
    apiMock = {
      fetch: jest.fn().mockReturnValue(Promise.resolve())
    };
    appStoreMock = {
      neighborhoodStore: {
        neighborhoodsByCityId: {
          set: () => { },
          get: () => { }
        }
      }
    };

    neighborhoodProvider = new NeighborhoodProvider(appStoreMock, apiMock);
  });

  afterEach(() => jest.resetAllMocks());

  describe('Load neighborhoods', () => {
    it('should call api only once', () => {
      return Promise.all([neighborhoodProvider.loadNeighborhoodByCityId(1), neighborhoodProvider.loadNeighborhoodByCityId(1)])
        .then(() => expect(apiMock.fetch).toHaveBeenCalledTimes(1));
    });
  });
});
