/**
 * Like provider communicates with the Apartments API to get user likes
 */
'use strict';

class LikeProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
  }

  get(listingId) {
    let isSyncedWithServer = this.appStore.likeStore.isSyncedWithServer;
    if (this.appStore.authStore.isLoggedIn) {
      if (!isSyncedWithServer) {
        isSyncedWithServer = true;
        this.apiProvider.fetch('/api/apartments/v1/likes/user')
          .then((likedListingIdArr) => {
            let likesMap = {};
            likedListingIdArr.map((listingId) => likesMap[listingId] = true);
            this.appStore.likeStore.init(likesMap);
            return this.appStore.likeStore.likesByListingId.get(listingId);
          });
      }
      else {
        return this.appStore.likeStore.likesByListingId.get(listingId);
      }
    }
    else {
      return new Promise((resolve) => { resolve(); });
    }
  }
}

module.exports = LikeProvider;
