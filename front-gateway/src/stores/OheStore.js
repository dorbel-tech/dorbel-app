import { observable, asMap } from 'mobx';

export default class OheStore {
  @observable openHouseEvents;
  @observable oheByListingId;

  constructor(initialState) {
    this.openHouseEvents = initialState ? initialState.openHouseEvents : [];
    this.oheByListingId = asMap({});
  }

  toJson() {
    return {
      openHouseEvents: this.openHouseEvents
    };
  }

}
