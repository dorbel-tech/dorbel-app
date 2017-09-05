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
        .then((myLikes) => {
          let likesMap = {};
          myLikes.map(like => likesMap[like.apartment_id] = true);
          this.appStore.likeStore.init(likesMap);
        });
    }
    return this.appStore.likeStore.myLikes.get(apartmentId);
  }

  set(apartmentId, listingId, isLiked, tenant) {
    const method = isLiked ? 'POST' : 'DELETE';
    this.appStore.likeStore.myLikes.set(apartmentId, isLiked);
    return this.fetch(`apartments/${apartmentId}/likes`, { method, data: { listing_id: listingId, tenant } })
      .then(() => {
        if (isLiked) {
          window.analytics.track('client_listing_liked', { apartment_id: apartmentId, listing_id: listingId }); // For Facebook conversion tracking.
        }
      })
      .catch(() => {
        this.appStore.likeStore.myLikes.set(apartmentId, !isLiked);
      });
  }

  getLikesForListing(listingId, includeProfile=false) {
    return this.fetch(`listings/${listingId}/likes?include_profile=${includeProfile}`)
    .then(likes => this.appStore.likeStore.likesByListingId.set(listingId, likes));
  }
}

module.exports = LikeProvider;
