/**
 * Like provider communicates with the Apartments API to get user likes
 */
'use strict';

class LikeProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
    this.isSyncedWithServer = false;
  }

  fetch(path, options) {
    return this.apiProvider.fetch('/api/apartments/v1/' + path, options);
  }

  get(apartmentId) {
    if (this.appStore.authStore.isLoggedIn && !this.isSyncedWithServer) {
      this.isSyncedWithServer = true; // Sync once with server
      this.fetch('likes/user')
        .then((likedApartmentIdArr) => {
          let likesMap = {};
          likedApartmentIdArr.map((apartmentId) => likesMap[apartmentId] = true);
          this.appStore.likeStore.init(likesMap);
        });
    }
    return this.appStore.likeStore.myLikes.get(apartmentId);
  }

  set(apartmentId, listingId, isLiked) {
    const method = isLiked ? 'POST' : 'DELETE';
    this.appStore.likeStore.myLikes.set(apartmentId, isLiked);
    return this.fetch(`likes/${apartmentId}`, { method, data: { listing_id: listingId } })
      .then(() => {
        if (isLiked) {
          window.analytics.track('client_listing_liked', { apartment_id: apartmentId, listing_id: listingId }); // For Facebook conversion tracking.
        }
      })
      .catch(() => {
        this.appStore.likeStore.myLikes.set(apartmentId, !isLiked);
      });
  }

  getLikesForListing(listing_id, include_profile=false) {
    return this.fetch('likes/by-listing/' + listing_id + '?include_profile=' + include_profile)
    .then(likes => this.appStore.likeStore.likesByListingId.set(listing_id, likes));
  }
}

module.exports = LikeProvider;
