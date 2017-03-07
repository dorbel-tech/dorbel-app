import { observable, asMap } from 'mobx';
import _ from 'lodash';
import OheModel from './models/OheModel';

export default class OheStore {
  @observable oheById;
  @observable usersFollowsByListingId;

  constructor(initialState) {
    initialState = initialState || {};

    if (initialState.oheById) {
      initialState.oheById = _.mapValues(initialState.oheById, ohe => new OheModel(ohe));
    }

    this.usersFollowsByListingId = asMap(initialState.usersFollowsByListingId || {});
    this.oheById = asMap(initialState.oheById || {});
  }

  oheByListingId(listing_id) {
    const result = [];
    for (var ohe of this.oheById.values()) {
      if (ohe.listing_id === listing_id) {
        result.push(ohe);
      }
    }
    return _.sortBy(result, 'start_time');
  }

  add(openHouseEvents) {
    openHouseEvents.forEach(ohe => {
      this.oheById.set(ohe.id, new OheModel(ohe));
    });
  }

  toJson() {
    return {
      oheById: this.oheById,
      usersFollowsByListingId: this.usersFollowsByListingId
    };
  }

}
