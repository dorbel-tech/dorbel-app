import { observable, asMap } from 'mobx';

export default class OheStore {
  @observable oheById;
  @observable usersFollowsByListingId;

  constructor(initialState) {    
    initialState = initialState || {};
    this.oheById = asMap(initialState.oheById || {});
    this.usersFollowsByListingId = asMap({});
  }

  oheByListingId(listing_id) {
    const result = [];
    for (var ohe of this.oheById.values()) {
      if (ohe.listing_id === listing_id) {
        result.push(ohe);
      }
    }
    return result;
  }

  add(openHouseEvents) {
    openHouseEvents.forEach(ohe => {
      this.oheById.set(ohe.id, ohe);
    });
  }

  toJson() {
    return {
      oheById: this.oheById
    };
  }

}
