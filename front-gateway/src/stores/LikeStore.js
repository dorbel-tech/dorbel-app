'use-strict';
import { observable, asMap } from 'mobx';

export default class LikeStore {
  @observable likesByListingId;
  @observable likesCountByListingId;

  constructor(initialState = {}) {
    if (initialState.likesByListingId) {
      this.init(initialState.likesByListingId);
    }
    else {
      this.likesByListingId = asMap({});
    }

    this.likesCountByListingId = asMap(initialState.likesCountByListingId || {});
  }

  init(listingIdMap) {
    this.likesByListingId = asMap(listingIdMap);
  }

  toJson() {
    return {
      likesByListingId: this.likesByListingId,
      likesCountByListingId: this.likesCountByListingId
    };
  }
}
