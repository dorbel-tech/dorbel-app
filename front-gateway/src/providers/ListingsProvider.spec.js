'use strict';
import { stub, spy } from 'sinon';
require('sinon-as-promised');

import ListingsProvider from './ListingsProvider';

describe('Listings Provider', () => {
  let listingsProvider;
  let listingStoreMock;
  let apiMock;

  beforeAll(() => {
    apiMock = {};

    listingStoreMock = {
      listingViewsById: {
        set: spy()
      }
    };

    listingsProvider = new ListingsProvider({ listingStore: listingStoreMock }, { api: apiMock });
  });

  it('should call API to load listing page views and save them store', () => {
    var listingId = 888;
    var views = 999;
    apiMock.fetch = stub().resolves({ [listingId] : { views } });

    return listingsProvider.loadListingPageViews({ id: listingId })
    .then(() => {
      expect(apiMock.fetch.calledWith('/api/apartments/v1/page_views/listings/' + listingId)).toBe(true);
      expect(listingStoreMock.listingViewsById.set.calledWith(listingId, views)).toBe(true);
    });
  });
});
