import { observable, asMap, computed } from 'mobx';
import autobind from 'react-autobind';

export default class ListingStore {
  @observable listingsById;
  @observable listingViewsById;
  @observable isLoading = false;

  constructor(initialState = {}, authStore) {
    this.listingsById = asMap(initialState.listingsById || {});
    this.listingsBySlug = asMap(initialState.listingsBySlug || {});
    this.listingViewsById = asMap(initialState.listingViewsById || {});
    this.authStore = authStore;
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

  isListingPublisher(listing) {
    const profile = this.authStore.profile;
    if (!profile) { return false; }

    const userIsListingPublisher = listing.publishing_user_id === profile.dorbel_user_id;
    const userIsAdmin = profile.role === 'admin';
    return userIsListingPublisher || userIsAdmin;
  }

  toJson() {
    return {
      listingsById: this.listingsById,
      listingsBySlug: this.listingsBySlug,
      listingViewsById: this.listingViewsById
    };
  }
}
