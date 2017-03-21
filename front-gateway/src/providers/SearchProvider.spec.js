'use strict';
import SearchProvider from './SearchProvider';

describe('SearchProvider', () => {
  let searchProvider;
  let appStoreMock;
  let mockSearchResults;
  let appProvidersMock;

  beforeEach(() => {
    mockSearchResults = [{ id: 123 }, { id: 456 }];

    appProvidersMock = {
      api : {
        fetch: jest.fn().mockReturnValue(Promise.resolve(mockSearchResults))
      },
      ohe : {
        loadListingEvents: jest.fn()
      }
    };

    appStoreMock = {
      searchStore: {
        reset: jest.fn(),
        add: jest.fn()
      }
    };

    searchProvider = new SearchProvider(appStoreMock, appProvidersMock);
  });

  it('should call API to load search results and save them to store', () => {
    return searchProvider.search()
      .then(() => {
        expect(appStoreMock.searchStore.add).toHaveBeenCalledWith(mockSearchResults);
      });
  });

  it('should resolve with search results', () => {
    return searchProvider.search()
      .then(results => expect(results).toBe(mockSearchResults));
  });

  it('should loadListingEvents with search results listing ids', () => {
    return searchProvider.search()
      .then(() => {
        expect(appProvidersMock.ohe.loadListingEvents).toHaveBeenCalledWith(mockSearchResults.map(listing => listing.id));
      });
  });

  it('should reset search store on new search', () => {
    return searchProvider.search()
      .then(() => expect(appStoreMock.searchStore.reset).toHaveBeenCalled());
  });

  it('should mark isLoading as false when results are in', () => {
    appStoreMock.searchStore.isLoading = true; // isLoading is set to true using searchStore.reset() so we don't check it here specifically
    return searchProvider.search()
      .then(() => expect(appStoreMock.searchStore.isLoading).toBe(false));
  });

  it('should not clear search when requesting next page', () => {
    return searchProvider.loadNextPage()
      .then(() => expect(appStoreMock.searchStore.reset).not.toHaveBeenCalled());
  });

  it('should use same query when requesting next page', () => {
    var someQuery = { abc: 123 };
    return searchProvider.search(someQuery)
      .then(() => {
        expect(appProvidersMock.api.fetch).toHaveBeenCalledWith('/api/apartments/v1/listings', { params: {
          q: JSON.stringify(someQuery),
          limit: 25
        }});
        appStoreMock.searchStore.length = 25;
        return searchProvider.loadNextPage();
      })
      .then(() => {
        expect(appProvidersMock.api.fetch).toHaveBeenLastCalledWith('/api/apartments/v1/listings', { params: {
          q: JSON.stringify(someQuery),
          limit: 25,
          offset: 25
        }});
      });
  });
});
