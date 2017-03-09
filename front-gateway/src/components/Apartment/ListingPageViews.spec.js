'use strict';
import React from 'react';
import { shallow, mount } from 'enzyme';

import ListingPageViews from './ListingPageViews';

describe('Search', () => {
  let appStoreMock;
  let appProvidersMock;

  beforeAll(() => {
    appProvidersMock = {
      apartmentsProvider: {
        loadListingPageViews: jest.fn()
      }
    };
    appStoreMock = {
      listingStore: {
        isListingPublisher: jest.fn(),
        listingViewsById: {
          has: jest.fn(),
          get: jest.fn()
        }
      }
    };
  });

  const listingPageViews = (listing)=> shallow(
    <ListingPageViews.wrappedComponent appStore={appStoreMock} appProviders={appProvidersMock} listing={listing || {}} />
  );

  it('should display page views from listingStore', () => {
    const pageViews = 9384;
    const listing = { id: 777 };
    appStoreMock.listingStore.isListingPublisher.mockReturnValue(true);
    appStoreMock.listingStore.listingViewsById.has.mockReturnValue(true);
    appStoreMock.listingStore.listingViewsById.get.mockReturnValue(pageViews);

    const rendered = listingPageViews(listing);

    expect(rendered.text()).toContain(`${pageViews} צפיות`);
    expect(appStoreMock.listingStore.listingViewsById.get).toHaveBeenCalledWith(listing.id);
  });

  it('should not display if not listing publisher', () => {
    const listing = { id: 15234 };
    appStoreMock.listingStore.isListingPublisher.mockReturnValue(false);

    const rendered = listingPageViews(listing);

    expect(rendered.text()).toBe('');
    expect(appStoreMock.listingStore.isListingPublisher).toHaveBeenCalledWith(listing);
  });

  it('should not display if there are no views in the store', () => {
    const listingId = 23423;
    appStoreMock.listingStore.isListingPublisher.mockReturnValue(true);
    appStoreMock.listingStore.listingViewsById.has.mockReturnValue(false);

    const rendered = listingPageViews({ id: listingId });

    expect(rendered.text()).toBe('');
    expect(appStoreMock.listingStore.isListingPublisher).toHaveBeenCalledWith({ id: listingId });
    expect(appStoreMock.listingStore.listingViewsById.has).toHaveBeenCalledWith(listingId);
  });

  it('should call provider to get pageviews if they do not exist in store', () => {
    const listing = { id: 4781 };
    appStoreMock.listingStore.listingViewsById.has.mockReturnValue(false);

    mount(<ListingPageViews.wrappedComponent appStore={appStoreMock} appProviders={appProvidersMock} listing={listing} />);

    expect(appStoreMock.listingStore.listingViewsById.has).toHaveBeenCalledWith(listing.id);
    expect(appProvidersMock.apartmentsProvider.loadListingPageViews).toHaveBeenCalledWith(listing);
  });


});
