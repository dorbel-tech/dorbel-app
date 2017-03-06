'use-strict';
import { observable, asMap } from 'mobx';

export default class LikeStore {
  @observable likesByListingId;
  @observable isSyncedWithServer;

  constructor(initialState = {}) {
    if (initialState.likesByListingId) {
      this.init(initialState.likesByListingId);
    }
    else {
      this.likesByListingId = asMap({});
    }
  }

  init(listingIdMap) {
    this.isSyncedWithServer = true;
    this.likesByListingId = asMap(listingIdMap);
  }

  toJson() {
    return {
      likesByListingId: this.likesByListingId,
      isSyncedWithServer: this.isSyncedWithServer
    };
  }
}
