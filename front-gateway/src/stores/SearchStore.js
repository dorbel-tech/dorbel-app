'use-strict';
import { observable, computed } from 'mobx';

export default class SearchStore {
  @observable searchResultsbyListingId;
  @observable activeFilterId = null;
  @observable isLoadingNewSearch = false;
  @observable isLoadingNextPage = false;
  @observable hasMorePages = false;
  @observable searchError = false;
  @observable lastScrollTop = 0;

  constructor(initialState) {
    this.searchResultsbyListingId = observable.map(initialState || {});
  }

  @computed get length() {
    return this.searchResultsbyListingId.size;
  }

  searchResults() {
    return this.searchResultsbyListingId.values(); // ordered by insertion order
  }

  reset() {
    this.searchResultsbyListingId.clear();
    this.isLoadingNewSearch = false;
    this.isLoadingNextPage = false;
    this.hasMorePages = false;
  }

  add(listings) {
    listings.forEach(listing => this.searchResultsbyListingId.set(listing.id, listing));
  }

  set lastScrollTop(value) {
    this.lastScrollTop = value;
  }

  toJson() {
    return this.searchResultsbyListingId;
  }
}
