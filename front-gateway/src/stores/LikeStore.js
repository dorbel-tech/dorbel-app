'use-strict';
import { observable, asMap } from 'mobx';

export default class LikeStore {
  @observable userLikesByListingId;
  @observable likesByListingId;

  constructor(initialState = {}) {
    initialState = initialState || {};

    if (initialState.userLikesByListingId) {
      this.init(initialState.userLikesByListingId);
    }
    else {
      this.userLikesByListingId = asMap({});
    }

    this.likesByListingId = asMap(initialState.likesByListingId || {});
  }

  init(listingIdMap) {
    this.userLikesByListingId = asMap(listingIdMap);
  }

  toJson() {
    return {
      userLikesByListingId: this.userLikesByListingId,
      likesByListingId: this.likesByListingId,
    };
  }
}
