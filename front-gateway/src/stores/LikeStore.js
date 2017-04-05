'use-strict';
import { observable, asMap } from 'mobx';

export default class LikeStore {
  @observable likesByListingId;

  constructor(initialState = {}) {
    if (initialState.likesByListingId) {
      this.init(initialState.likesByListingId);
    }
    else {
      this.likesByListingId = asMap({});
    }
  }

  init(listingIdMap) {
    this.likesByListingId = asMap(listingIdMap);
  }

  toJson() {
    return {
      likesByListingId: this.likesByListingId,
    };
  }
}
