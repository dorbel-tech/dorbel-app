'use-strict';
import { observable } from 'mobx';

export default class MatchingUsersStore {
  @observable listingIdsToProfiles;

  constructor() {
    this.listingIdsToProfiles = observable.map({});
  }

  get(listingId) {
    return this.listingIdsToProfiles.get(listingId);
  }

  set(listingId, userProfiles) {
    this.listingIdsToProfiles.set(listingId, userProfiles);
  }
}
