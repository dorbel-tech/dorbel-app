'use-strict';
import { observable, asMap, computed } from 'mobx';

export default class ListingStore {
  @observable searchResultsbyListingId;
  @observable isLoadingNewSearch = false;
  @observable isLoadingNextPage = false;
  @observable hasMorePages = false;
  @observable searchError = false;

  constructor(initialState) {
    this.searchResultsbyListingId = asMap(initialState || {});
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

  toJson() {
    return this.searchResultsbyListingId;
  }
}
