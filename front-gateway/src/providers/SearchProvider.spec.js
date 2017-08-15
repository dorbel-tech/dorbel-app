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
        fetch: jest.fn().mockReturnValue(Promise.resolve(mockSearchResults)),
        mutate: jest.fn()
      },
      ohe : {
        loadListingEvents: jest.fn()
      }
    };

    appStoreMock = {
      searchStore: {
        reset: jest.fn(),
        add: jest.fn(),
        filters: {
          set: jest.fn()
        }
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
      .then(() => {
        expect(appStoreMock.searchStore.isLoadingNewSearch).toBe(false);
        expect(appStoreMock.searchStore.isLoadingNextPage).toBe(false);
      });
  });

  it('should not reset search when requesting next page', () => {
    return searchProvider.loadNextPage()
      .then(() => expect(appStoreMock.searchStore.reset).not.toHaveBeenCalled());
  });

  it('should not reset search store twice when searching with the same query', () => {
    var someQuery = { abc: 123 };
    return searchProvider.search(someQuery)
      .then(() => {
        expect(appProvidersMock.api.fetch).toHaveBeenCalledWith('/api/apartments/v1/listings', { params: {
          q: JSON.stringify(someQuery),
          limit: 15
        }});
        return searchProvider.search(someQuery);
      })
      .then(() => {
        // TODO: Make this scenario call the api only once
        //expect(appProvidersMock.api.fetch.mock.calls.length).toBe(1);
        expect(appStoreMock.searchStore.reset.mock.calls.length).toBe(1);
      });
  });

  it('should use same query when requesting next page', () => {
    var someQuery = { abc: 123 };
    return searchProvider.search(someQuery)
      .then(() => {
        expect(appProvidersMock.api.fetch).toHaveBeenCalledWith('/api/apartments/v1/listings', { params: {
          q: JSON.stringify(someQuery),
          limit: 15
        }});
        appStoreMock.searchStore.length = 15;
        return searchProvider.loadNextPage();
      })
      .then(() => {
        expect(appProvidersMock.api.fetch).toHaveBeenLastCalledWith('/api/apartments/v1/listings', { params: {
          q: JSON.stringify(someQuery),
          limit: 15,
          offset: 15
        }});
      });
  });

  it('should not search while searching', () => {
    let resolveFetch;
    appProvidersMock.api.fetch.mockReturnValue(new Promise(resolve => resolveFetch = resolve));
    const promises = [
      searchProvider.search(),
      searchProvider.search()
    ];
    resolveFetch();
    return Promise.all(promises)
    .then(() => {
      expect(appProvidersMock.api.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('should not get next page while getting next page', () => {
    let resolveFetch;
    appProvidersMock.api.fetch.mockReturnValue(new Promise(resolve => resolveFetch = resolve));
    const promises = [
      searchProvider.loadNextPage(),
      searchProvider.loadNextPage()
    ];
    resolveFetch();
    return Promise.all(promises)
    .then(() => {
      expect(appProvidersMock.api.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('should set last scroll top correctly', () => {
    const scrollTopMock = jest.fn();
    const scrollKeyMock = jest.fn();

    searchProvider.setLastScrollTop(scrollTopMock, scrollKeyMock);

    expect(appStoreMock.searchStore.lastScrollTop).toBe(scrollTopMock);
    expect(searchProvider.lastScrollKey).toBe(scrollKeyMock);
  });

  it('should return 0 as last scroll top for new scroll key', () => {
    const scrollTopMock = jest.fn();
    const scrollKeyMock = jest.fn();
    const newScrollKeyMock = jest.fn();

    searchProvider.setLastScrollTop(scrollTopMock, scrollKeyMock);

    expect(searchProvider.getLastScrollTop(newScrollKeyMock)).toBe(0);
  });

  it('should getLastScrollTop correctly', () => {
    const scrollTopMock = jest.fn();
    const scrollKeyMock = jest.fn();

    searchProvider.setLastScrollTop(scrollTopMock, scrollKeyMock);

    expect(searchProvider.getLastScrollTop(scrollKeyMock)).toBe(scrollTopMock);
  });

  describe('saved filters', () => {
    it('should save new filter, update store and make new filter active', () => {
      const mockFilter = { city: 5, mrs: 2000, maxRooms: 5 };
      const mockReturnFilter = { id: 8 };
      appProvidersMock.api.mutate.mockReturnValue(Promise.resolve({ data: { upsertFilter: mockReturnFilter } }));

      return searchProvider.saveFilter(mockFilter).then(() => {
        expect(appProvidersMock.api.mutate.mock.calls[0][1]).toEqual({ filter: mockFilter });
        expect(appStoreMock.searchStore.activeFilterId).toBe(mockReturnFilter.id);
      });
    });

    it('should clear neighborhood:* from filter', () => {
      const mockFilter = { city: 5, neighborhood: '*', minRooms: 3, mre: 4000 };
      appProvidersMock.api.mutate.mockReturnValue(Promise.resolve({ data: { upsertFilter: {} } }));
      return searchProvider.saveFilter(mockFilter).then(() => {
        expect(appProvidersMock.api.mutate.mock.calls[0][1].filter.neighborhood).toBeUndefined();
      });
    });

    it('should reset active filter', () => {
      appStoreMock.searchStore.activeFilterId = 8;
      searchProvider.resetActiveFilter();
      expect(appStoreMock.searchStore.activeFilterId).toBeNull();
    });

    it('should throw error and not call API when missing minimal fields', () => {
      expect.assertions(2);
      return searchProvider.saveFilter({ city: 5 })
      .catch(err => {
        expect(err).toHaveProperty('message', 'על מנת לשמור חיפוש - יש לבחור עיר, מספר חדרים ומחיר');
        expect(appProvidersMock.api.fetch).not.toHaveBeenCalled();
      });
    });
  });
});
