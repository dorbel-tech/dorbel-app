/**
 * Like provider communicates with the Apartments API to get user likes
 */
'use strict';

class LikeProvider {
  constructor(appStore, apiProvider) {
    this.appStore = appStore;
    this.apiProvider = apiProvider;
    this.getAllUserLikes();
  }

  getAllUserLikes() {
    if (this.appStore.authStore.isLoggedIn) {
      this.apiProvider.fetch('/api/apartments/v1/likes/user')
        .then((likedListingIdArr) => {
          let likesMap = {};
          likedListingIdArr.map((listingId) => likesMap[listingId] = true);
          this.appStore.likeStore.init(likesMap);
        });
    }
  }

  get(listingId) {
    return this.appStore.likeStore.likesByListingId.get(listingId);
  }

  set(listingId, isLiked) {
    const method = isLiked ? 'POST' : 'DELETE';
    this.appStore.likeStore.likesByListingId.set(listingId, isLiked); 
    return this.apiProvider.fetch(`/api/apartments/v1/likes/${listingId}`, { method })
      .catch(() => { this.appStore.likeStore.likesByListingId.set(listingId, !isLiked); });
  }
}

module.exports = LikeProvider;
