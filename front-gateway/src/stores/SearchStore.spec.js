'use strict';
import SearchStore from './SearchStore';

describe('Search Store', () => {
  let searchStore;

  beforeEach(() => {
    searchStore = new SearchStore();
  });

  it('should not add duplicate lisitings', () => {
    const listingsWithDuplicates = [
      { id: 1 },
      { id: 2 },
      { id: 1 }
    ];

    searchStore.add(listingsWithDuplicates);
    expect(searchStore.length).toBe(2);
  });

  it('should return search results array, sorted by insertion order', () => {
    // this is important for paging to make sense
    searchStore.add([ { id: 3 }, { id: 4 } ]);
    searchStore.add([ { id: 1 } ]);

    expect(searchStore.searchResults()).toEqual([ { id: 3 }, { id: 4 }, { id: 1 }]);
  });

  it('should reset to empty array with isLoading and !hasMorePages', () => {
    searchStore.add([ { id: 3 }, { id: 4 } ]);
    searchStore.isLoading = false;
    searchStore.hasMorePages = true;

    searchStore.reset();

    expect(searchStore.searchResults()).toEqual([]);
    expect(searchStore.isLoading).toBe(true);
    expect(searchStore.hasMorePages).toBe(false);
  });
});
