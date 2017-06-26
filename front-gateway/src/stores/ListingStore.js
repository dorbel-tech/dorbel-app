import { observable, asMap, computed } from 'mobx';
import autobind from 'react-autobind';

export default class ListingStore {
  @observable listingsById;
  @observable lastListingByApartmentId;
  @observable listingViewsById;
  @observable listingTenantsById;
  @observable listingsByApartmentId;
  @observable isLoading = false;

  constructor(initialState = {}, authStore) {
    this.listingsById = asMap(initialState.listingsById || {});
    this.lastListingByApartmentId = asMap(initialState.lastListingByApartmentId || {});
    this.listingsBySlug = asMap(initialState.listingsBySlug || {});
    this.listingViewsById = asMap(initialState.listingViewsById || {});
    this.listingTenantsById = asMap(initialState.listingTenantsById || {});
    this.listingsByApartmentId = asMap(initialState.listingsByApartmentId || {});
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

  getByApartmentId(apartmentId){
    return this.lastListingByApartmentId.get(apartmentId);
  }

  set(listing) {
    this.listingsById.set(listing.id, listing);

    if (listing.slug) {
      this.listingsBySlug.set(listing.slug, listing);
    }
  }

  setLastByApartmentId(listing) {
    this.lastListingByApartmentId.set(listing.apartment_id, listing);
  }

  @computed get apartments() {
    return this.listingsById.values();
  }

  clearAndSet(listings) {
    // TODO: Remove the clear and use the computed listings to filter the view.
    this.listingsById.clear();
    this.listingsBySlug.clear();
    this.lastListingByApartmentId.clear();
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

    const userIsListingPublisher = listing.publishing_user_id === profile.dorbel_user_id;
    return userIsListingPublisher || this.userIsAdmin();
  }

  userIsAdmin() {
    const profile = this.authStore.profile;
    if (!profile) { return false; }

    return profile.role === 'admin';
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
