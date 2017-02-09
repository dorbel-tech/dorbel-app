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
    const id = parseInt(idOrSlug);
    if(isNaN(id)){
      return this.listingsBySlug.get(decodeURI(idOrSlug));
    }
    else{
      return this.listingsById.get(id);
    }
  }

  add(listing) {
    this.listingsById.set(listing.id, listing);
    if (listing.slug) {
      this.listingsBySlug.set(decodeURI(listing.slug), listing);
    }
  }

  @computed get apartments() {
    return this.listingsById.values();
  }

  clearAndSet(listings) {
    // TODO: Remove the clear and use the computed apartments to filter the view.
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
