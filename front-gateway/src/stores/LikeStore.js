'use-strict';
import { observable } from 'mobx';

export default class LikeStore {
  @observable myLikes;

  constructor(initialState = {}) {
    initialState = initialState || {};

    if (initialState.myLikes) {
      this.init(initialState.myLikes);
    }
    else {
      this.myLikes = observable.map({});
    }

    this.likesByListingId = observable.map(initialState.likesByListingId || {});
  }

  init(apartmentIdMap) {
    this.myLikes = observable.map(apartmentIdMap);
  }

  toJson() {
    return {
      myLikes: this.myLikes,
      likesByListingId: this.likesByListingId,
    };
  }
}
