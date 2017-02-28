import { observable, asMap, computed } from 'mobx';
import autobind from 'react-autobind';

export default class ListingStore {
  @observable listingsById;
  @observable isLoading = false;

  constructor(initialState = {}) {
    this.listingsById = asMap(initialState.listingsById || {});
    this.listingsBySlug = asMap(initialState.listingsBySlug || {});
    autobind(this);
  }

  get(idOrSlug){
    if(isNaN(idOrSlug)){
      return this.listingsBySlug.get(idOrSlug);
    }
    else{
      return this.listingsById.get(idOrSlug);
    }
  }

  add(listing) {
    this.listingsById.set(listing.id, listing);
    if (listing.slug) {
      this.listingsBySlug.set(listing.slug, listing);
    }
  }

  @computed get apartments() {
    return this.listingsById.values();
  }

  clearAndSet(listings) {
    // TODO: Remove the clear and use the computed listings to filter the view.
    this.listingsById.clear();
    this.listingsBySlug.clear();
    listings.forEach(this.add);

    this.isLoading = false;
  }

  update(listingId, updates) {
    const listing = this.listingsById.get(listingId);
    this.listingsById.set(listingId, Object.assign(listing, updates));
  }

  toJson() {
    return {
      listingsById: this.listingsById,
      listingsBySlug: this.listingsBySlug
    };
  }
}
