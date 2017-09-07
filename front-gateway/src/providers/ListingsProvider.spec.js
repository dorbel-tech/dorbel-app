'use strict';
import ListingsProvider from './ListingsProvider';

describe('Listings Provider', () => {
  let listingsProvider, appStoreMock, apiMock, navProviderMock;

  beforeEach(() => {
    navProviderMock = {
      setRoute: jest.fn()
    };
    apiMock = {};
    appStoreMock = {
      listingStore: {
        listingViewsById: {
          set: jest.fn()
        },
        listingsByApartmentId: {
          get: jest.fn()
        }
      },
      newListingStore: {
        loadListing: jest.fn(),
        reset: jest.fn()
      }
    };

    listingsProvider = new ListingsProvider(appStoreMock, { api: apiMock, navProvider: navProviderMock });
  });

  it('should call API to load listing page views and save them store', () => {
    const listingId = 888;
    const views = 999;
    apiMock.fetch = jest.fn();
    apiMock.fetch.mockReturnValue(Promise.resolve({ [listingId] : { views } }));

    return listingsProvider.loadListingPageViews(listingId)
    .then(() => {
      expect(apiMock.fetch).toHaveBeenCalledWith('/api/apartments/v1/page_views/listings/' + listingId);
      expect(appStoreMock.listingStore.listingViewsById.set).toHaveBeenCalledWith(listingId, views);
    });
  });
});
