'use strict';
import ListingsProvider from './ListingsProvider';

describe('Listings Provider', () => {
  let listingsProvider, appStoreMock, apiMock, routerMock;

  beforeEach(() => {
    routerMock = {
      setRoute: jest.fn()
    };
    apiMock = {};
    appStoreMock = {
      listingStore: {
        listingViewsById: {
          set: jest.fn()
        }
      },
      newListingStore: {
        loadListing: jest.fn(),
        reset: jest.fn()
      }
    };

    listingsProvider = new ListingsProvider(appStoreMock, { api: apiMock }, routerMock);
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

  describe('republish', () => {
    it('should reset new listing store', () => {
      listingsProvider.republish({});
      expect(appStoreMock.newListingStore.reset).toHaveBeenCalled();
    });

    it('should send cloned property to new listing store', () => {
      const listing = { apartment: { id: 7 } };
      listingsProvider.republish(listing);
      const listingSentToStore = appStoreMock.newListingStore.loadListing.mock.calls[0][0]; // first call first argument
      expect(listingSentToStore).not.toBe(listing);
      expect(listingSentToStore.apartment.id).toEqual(listing.apartment.id);
    });

    it('should use current lease_end + 1 day as new lease_start', () => {
      const listing = { lease_end: '2010-01-01T00:00:00.000Z' };
      listingsProvider.republish(listing);
      const listingSentToStore = appStoreMock.newListingStore.loadListing.mock.calls[0][0]; // first call first argument
      expect(listingSentToStore.lease_start).toBe('2010-01-02T00:00:00.000Z');
    });

    it('should route to new form', () => {
      listingsProvider.republish({});
      expect(routerMock.setRoute).toHaveBeenCalledWith('/apartments/new_form');
    });

    it.skip('should rented listing is republishable', () => {
      // this is skipped until we release this feature
      expect(listingsProvider.isRepublishable({ status: 'rented' })).toBe(true);
    });

    it('should rented listing is NOT republishable', () => {
      expect(listingsProvider.isRepublishable({ status: 'rented' })).toBe(false);
    });

    it('should listed listing is not republishable', () => {
      expect(listingsProvider.isRepublishable({ status: 'listed' })).toBe(false);
    });
  });
});
