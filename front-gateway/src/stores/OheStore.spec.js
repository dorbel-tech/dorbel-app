'use strict';
import OheStore from './OheStore';

describe('OHE Store', () => {
  let oheStore;

  beforeEach(() => {
    oheStore = new OheStore();
  });

  it('should mark and indicate listing has been loaded', () => {
    oheStore.markListingsAsLoaded([1,3]);
    expect(oheStore.isListingLoaded(1)).toBe(true);
    expect(oheStore.isListingLoaded(2)).toBe(false);
    expect(oheStore.isListingLoaded(3)).toBe(true);
  });

  it('should get events by listing Id', () => {
    oheStore.add([
      { id: 1, listing_id: 7 },
      { id: 2, listing_id: 8 },
      { id: 3, listing_id: 7 },
      { id: 4, listing_id: 7 }
    ]);
    oheStore.markListingsAsLoaded([7]);

    const results = oheStore.oheByListingId(7);
    expect(results.length).toBe(3);
    expect(results.find(ohe => ohe.id === 2)).toBeUndefined();
  });

  it('should not return ohe by listing ID until the listing is marked as loaded', () => {
    const listing_id = 8;
    oheStore.add([{ id: 1, listing_id }]);
    expect(oheStore.oheByListingId(listing_id)).toBeUndefined();
    oheStore.markListingsAsLoaded([listing_id]);
    expect(oheStore.oheByListingId(listing_id)).toHaveLength(1);
  });
});
