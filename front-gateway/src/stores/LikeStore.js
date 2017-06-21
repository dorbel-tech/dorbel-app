'use-strict';
import { observable, asMap } from 'mobx';

export default class LikeStore {
  @observable myLikes;

  constructor(initialState = {}) {
    initialState = initialState || {};

    if (initialState.myLikes) {
      this.init(initialState.myLikes);
    }
    else {
      this.myLikes = asMap({});
    }

    this.likesByListingId = asMap(initialState.likesByListingId || {});
  }

  init(apartmentIdMap) {
    this.myLikes = asMap(apartmentIdMap);
  }

  toJson() {
    return {
      myLikes: this.myLikes,
      likesByListingId: this.likesByListingId,
    };
  }
}
