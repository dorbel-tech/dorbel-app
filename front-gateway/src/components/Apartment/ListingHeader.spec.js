'use strict';
import React from 'react';
import { shallow } from 'enzyme';

import ListingHeader from './ListingHeader';
import ListingPageViews from './ListingPageViews';

describe('Listing Header', () => {
  let appStoreMock;

  beforeAll(() => {
    appStoreMock = {
      listingStore: {
        isListingPublisherOrAdmin: jest.fn(),
      }
    };
  });

  it('should render page views with listing when user is listinging publisher', () => {
    const listing = { id: 3, images: [] };
    appStoreMock.listingStore.isListingPublisherOrAdmin.mockReturnValue(true);

    const rendered = shallow(<ListingHeader.wrappedComponent appStore={appStoreMock} listing={listing} />);

    const pageViews = rendered.find(ListingPageViews).first();
    expect(pageViews.exists()).toBe(true);
    expect(pageViews.prop('listing')).toBe(listing);
  });

  it('should not render page views when user is not listing publisher', () => {
    const listing = { id: 3, images: [] };
    appStoreMock.listingStore.isListingPublisherOrAdmin.mockReturnValue(false);

    const rendered = shallow(<ListingHeader.wrappedComponent appStore={appStoreMock} listing={listing} />);

    expect(rendered.find(ListingPageViews).length).toBe(0);
  });
});
