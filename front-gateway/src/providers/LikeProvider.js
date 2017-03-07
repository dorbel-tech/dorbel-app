/**
 * Like provider communicates with the Apartments API to get user likes
 */
'use strict';

class LikeProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
  }

  set(listingId, isLiked) {
    return this.apiProvider.fetch(`/api/apartments/v1/likes/${listingId}`, { method: isLiked ? 'POST' : 'DELETE' })
      .then(() => { this.appStore.likeStore.likesByListingId.set(listingId, isLiked); })
      .catch(() => { this.appStore.likeStore.likesByListingId.set(listingId, !isLiked); });
  }

  get(listingId) {
    let isLikesSyncedWithServer = this.appStore.likeStore.isLikesSyncedWithServer;
    if (isLikesSyncedWithServer) {
      return this.appStore.likeStore.likesByListingId.get(listingId);
    }
    else {
      isLikesSyncedWithServer = true;
      this.apiProvider.fetch('/api/apartments/v1/likes/user')
        .then((likedListingIdArr) => {
          let likesMap = {};
          likedListingIdArr.map((listingId) => likesMap[listingId] = true);
          this.appStore.likeStore.init(likesMap);
          return this.appStore.likeStore.likesByListingId.get(listingId);
        });
    }
  }
}

module.exports = LikeProvider;
