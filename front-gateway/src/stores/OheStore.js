import { observable, asMap } from 'mobx';
import _ from 'lodash';
import OheModel from './models/OheModel';

export default class OheStore {
  @observable _loadedListingIds;
  // TODO: these should be encapsultaed in the store and not directly exposed
  @observable oheById;
  @observable usersFollowsByListingId;
  @observable countFollowersByListingId;

  constructor(initialState) {
    initialState = initialState || {};

    if (initialState.oheById) {
      initialState.oheById = _.mapValues(initialState.oheById, ohe => new OheModel(ohe));
    }

    this.followersByListingId = asMap(initialState.followersByListingId || {});
    this.countFollowersByListingId = asMap(initialState.countFollowersByListingId || {});
    this.usersFollowsByListingId = asMap(initialState.usersFollowsByListingId || {});
    this.oheById = asMap(initialState.oheById || {});
    this._loadedListingIds = asMap(this.oheById.values().reduce((byId, ohe) => (byId[ohe.listing_id] = true, byId), {}));
  }

  oheByListingId(listing_id) {
    if (this.isListingLoaded(listing_id)) {
      return _(this.oheById.values()).filter({ listing_id }).sortBy('start_time').value();
    }
    // undefined returned if listing is not loaded - so we can differ between not-loaded and no events
  }

  add(openHouseEvents) {
    openHouseEvents.forEach(ohe => {
      this.oheById.set(ohe.id, new OheModel(ohe));
    });
  }

  isListingLoaded(listing_id) {
    return this._loadedListingIds.has(listing_id);
  }

  markListingsAsLoaded(listing_ids) {
    listing_ids.forEach(listing_id => this._loadedListingIds.set(listing_id));
  }

  toJson() {
    return {
      oheById: this.oheById,
      followersByListingId: this.followersByListingId,
      countFollowersByListingId: this.countFollowersByListingId,
      usersFollowsByListingId: this.usersFollowsByListingId,
    };
  }

}
