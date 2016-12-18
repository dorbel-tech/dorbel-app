import { observable, asMap } from 'mobx';

export default class OheStore {
  @observable oheById;
  @observable oheByListingId;

  constructor(initialState) {    
    initialState = initialState || {};
    this.oheById = asMap(initialState.openHouseEventsById || {});
    this.oheByListingId = asMap(initialState.oheByListingId || {});
  }

  add(openHouseEvents) {
    openHouseEvents.forEach(ohe => {
      this.oheById.set(ohe.id, ohe);
      if (this.oheByListingId.has(ohe.listing_id)) {
        const byListingId = this.oheByListingId.get(ohe.listing_id);
        const indexOf = byListingId.indexOf(ohe);
        if (indexOf > -1) { 
          byListingId.push(ohe);
        } else {
          byListingId[indexOf] = ohe;
        }
      } else {
        this.oheByListingId.set(ohe.listing_id, [ohe]);
      }
    });
  }

  toJson() {
    return {
      oheById: this.oheById,
      oheByListingId: this.oheByListingId
    };
  }

}
