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
    searchStore.add([ { id: 3 }, { id: 4 }, { id: 57 } ]);
    searchStore.add([ { id: 1 }, { id: 2 }, { id: 80 } ]);

    expect(searchStore.searchResults().map(l => l.id)).toEqual([ 3, 4, 57, 1, 2, 80 ]);
  });

  it('should reset correctly', () => {
    searchStore.add([ { id: 3 }, { id: 4 } ]);
    searchStore.isLoadingNewSearch = true;
    searchStore.isLoadingNextPage = true;
    searchStore.hasMorePages = true;

    searchStore.reset();

    expect(searchStore.searchResults()).toEqual([]);
    expect(searchStore.isLoadingNewSearch).toBe(false);
    expect(searchStore.isLoadingNextPage).toBe(false);
    expect(searchStore.hasMorePages).toBe(false);
  });
});

