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

  get(listingId) {
    if (this.appStore.authStore.isLoggedIn && !this.isSyncedWithServer) {
      this.isSyncedWithServer = true; // Sync once with server
      this.fetch('likes/user')
        .then((likedListingIdArr) => {
          let likesMap = {};
          likedListingIdArr.map((listingId) => likesMap[listingId] = true);
          this.appStore.likeStore.init(likesMap);
        });
    }
    return this.appStore.likeStore.userLikesByListingId.get(listingId);
  }

  set(listingId, isLiked) {
    const method = isLiked ? 'POST' : 'DELETE';
    this.appStore.likeStore.userLikesByListingId.set(listingId, isLiked);
    return this.fetch(`likes/${listingId}`, { method })
      .then(() => {
        if (isLiked) {
          window.analytics.track('client_listing_liked', { listing_id: listingId }); // For Facebook conversion tracking.
        }
      })
      .catch(() => {
        this.appStore.likeStore.userLikesByListingId.set(listingId, !isLiked);
      });
  }

  getLikesForListing(listing_id, include_profile=false) {
    return this.fetch('likes/' + listing_id + '?include_profile=' + include_profile)
    .then(likes => this.appStore.likeStore.likesByListingId.set(listing_id, likes));
  }
}

module.exports = LikeProvider;
