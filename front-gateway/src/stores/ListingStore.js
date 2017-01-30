import { observable, asMap, computed } from 'mobx';
import autobind from 'react-autobind';

export default class ListingStore {
  @observable listingsById;

  constructor(initialState = {}) {
    this.listingsById = asMap(initialState.listingsById || {});
    autobind(this);
  }

  @computed get apartments() {
    return this.listingsById.values();
  }

  add(listings) {
    listings
      .forEach(listing => this.listingsById.set(listing.id, listing));
  }

  update(listingId, updates) {
    const listing = this.listingsById.get(listingId);
    this.listingsById.set(listingId, Object.assign(listing, updates));
  }

  toJson() {
    return {
      listingsById: this.listingsById
    };
  }
}
