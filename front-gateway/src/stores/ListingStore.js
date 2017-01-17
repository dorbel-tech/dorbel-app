import { observable, asMap, computed } from 'mobx';
import autobind from 'react-autobind';

export default class ListingStore {
  @observable listingsById = asMap({});

  constructor() {
    autobind(this);
  }

  @computed get apartments() {
    return this.listingsById.values();
  }

  add(listings) {
    // TODO: Remove the clear and use the computed apartments to filter the view.
    this.listingsById.clear();
    listings
      .forEach(listing => this.listingsById.set(listing.id, listing));
  }

  update(listingId, updates) {
    const listing = this.listingsById.get(listingId);
    this.listingsById.set(listingId, Object.assign(listing, updates));
  }

  toJson() {
    return { };
  }
}
