import { observable, asMap, computed } from 'mobx';
import autobind from 'react-autobind';

export default class ListingStore {
  @observable listingsById;
  @observable listingViewsById;
  @observable listingTenantsById;
  @observable isLoading = false;

  constructor(initialState = {}, authStore) {
    this.listingsById = asMap(initialState.listingsById || {});
    this.listingsBySlug = asMap(initialState.listingsBySlug || {});
    this.listingViewsById = asMap(initialState.listingViewsById || {});
    this.listingTenantsById = asMap(initialState.listingTenantsById || {});
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

  set(listing) {
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

  isListingPublisherOrAdmin(listing) {
    const profile = this.authStore.profile;
    if (!profile) { return false; }

    const userIsListingPublisher = listing.publishing_user_id === profile.id;
    const userIsAdmin = profile.role === 'admin';
    return userIsListingPublisher || userIsAdmin;
  }

  toJson() {
    return {
      listingsById: this.listingsById,
      listingsBySlug: this.listingsBySlug,
      listingViewsById: this.listingViewsById,
      listingTenantsById: this.listingTenantsById
    };
  }
}
