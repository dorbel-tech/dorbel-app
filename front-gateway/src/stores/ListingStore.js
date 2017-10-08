import { observable } from 'mobx';
import autobind from 'react-autobind';

export default class ListingStore {
  @observable listingsById;
  @observable listingViewsById;
  @observable listingTenantsById;
  @observable isLoading = false;

  constructor(initialState = {}, authStore) {
    this.listingsById = observable.map(initialState.listingsById || {});
    this.listingViewsById = observable.map(initialState.listingViewsById || {});
    this.listingTenantsById = observable.map(initialState.listingTenantsById || {});
    this.authStore = authStore;
    autobind(this);
  }

  get(listingId) {
    return this.listingsById.get(listingId);
  }

  set(listing) {
    this.listingsById.set(listing.id, listing);
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
      listingViewsById: this.listingViewsById,
      listingTenantsById: this.listingTenantsById
    };
  }
}
