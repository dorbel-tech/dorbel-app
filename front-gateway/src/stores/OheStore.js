import { observable, asMap } from 'mobx';

export default class OheStore {
  @observable openHouseEvents;
  @observable oheByListingId;

  constructor(initialState) {
    this.events = initialState ? initialState.openHouseEvents : [];
    this.oheByListingId = asMap({});
  }

  toJson() {
    return {
      events: this.openHouseEvents
    };
  }

}
