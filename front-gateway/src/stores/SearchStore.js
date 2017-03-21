'use-strict';
import { observable, asMap, computed } from 'mobx';

export default class ListingStore {
  @observable searchResultsbyListingId;
  @observable isLoading = true;
  @observable hasMorePages = false;

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
    this.isLoading = true;
    this.hasMorePages = false;
  }

  add(listings) {
    const listingsById = {};
    listings.forEach(listing => listingsById[listing.id] = listing);
    this.searchResultsbyListingId.merge(listingsById); // using merge instead of set to avoid triggering multiple renders
  }

  toJson() {
    return this.searchResultsbyListingId;
  }
}
