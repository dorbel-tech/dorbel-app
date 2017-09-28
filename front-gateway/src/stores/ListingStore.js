import { observable } from 'mobx';
import autobind from 'react-autobind';

export default class ListingStore {
  @observable listingsById;
  @observable listingViewsById;
  @observable listingTenantsById;
  @observable isLoading = false;

  constructor(initialState = {}, authStore) {
    this.listingsById = observable.map(initialState.listingsById || {});
    this.listingsBySlug = observable.map(initialState.listingsBySlug || {});
    this.listingViewsById = observable.map(initialState.listingViewsById || {});
    this.listingTenantsById = observable.map(initialState.listingTenantsById || {});
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

  isListingPublisherOrAdmin(listing) {
    const profile = this.authStore.profile;
    if (!profile) { return false; }

    const userIsListingPublisher = listing.publishing_user_id === profile.dorbel_user_id;
    return userIsListingPublisher || this.authStore.isUserAdmin();
  }

  toJson() {
    return {
      listingsById: this.listingsById,
      lastListingByApartmentId: this.lastListingByApartmentId,
      listingsBySlug: this.listingsBySlug,
      listingViewsById: this.listingViewsById,
      listingTenantsById: this.listingTenantsById
    };
  }
}
