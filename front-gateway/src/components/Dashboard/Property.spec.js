import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'mobx-react';

import Property from './Property';
import { flushPromises } from '~/providers/utils';

describe('Property', () => {
  let appStoreMock, appProvidersMock, propertyMock;

  beforeEach(() => {
    // because we mount Property (not just shallow), we need to mock all the dependencies of its children
    appStoreMock = {
      listingStore: {
        get: jest.fn(),
        listingViewsById: { get: jest.fn(), has: jest.fn() },
        isListingPublisherOrAdmin: jest.fn().mockReturnValue(true),
        listingsByApartmentId: { get: jest.fn() }
      },
      oheStore: {
        oheByListingId: jest.fn()
      },
      editedListingStore: {
        loadListing: jest.fn()
      },
      likeStore: {
        likesByListingId: { 
          get: jest.fn().mockReturnValue([]), 
          has: jest.fn() 
        }
      }
    };
    appProvidersMock = {
      listingsProvider: {
        loadListingPageViews: jest.fn(),
        loadFullListingDetails: jest.fn(),
        loadListingsForApartment: jest.fn(),
        isActiveListing: jest.fn().mockReturnValue(true)
      },
      oheProvider: {
        loadListingEvents: jest.fn()
      },
      navProvider: {},
      likeProvider: {
        getLikesForListing: jest.fn()
      }
    };
    propertyMock = {
      id: 7,
      apartment_id: 8,
      status: 'rented',
      apartment: {
        building: {}
      },
      images: [ { url: 'bla' } ]
    };
  });

  const shallowProperty = () => shallow(<Property.wrappedComponent appStore={appStoreMock} appProviders={appProvidersMock} listingId={'' + propertyMock.id} />);
  // TODO : mount is !!! terrible !!! here it needs a million dependencies - find a way to test without mount
  const mountProperty = () => mount(
    <Provider appStore={appStoreMock} appProviders={appProvidersMock} router={{}}>
      <Property listingId={'' + propertyMock.id} />
    </Provider>
  );

  it('should render in loading state', () => {
    const wrapper = shallowProperty();
    expect(wrapper.find('LoadingSpinner')).toHaveLength(1);
    expect(wrapper.state('isLoading')).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not be in loading state when the store has the property', () => {
    appStoreMock.listingStore.get.mockReturnValue(propertyMock);
    const wrapper = mountProperty();

    // this depends on ComponentDidMount + rerender after state.isLoading was changed
    return flushPromises().then(() => {
      expect(appStoreMock.editedListingStore.loadListing).toHaveBeenCalledWith(propertyMock);
      wrapper.update();
      expect(wrapper.find('LoadingSpinner')).toHaveLength(0);
    });
  });

  it('should start in loading state and then change when the provider gets the listing', () => {
    appProvidersMock.listingsProvider.loadFullListingDetails.mockReturnValue(Promise.resolve());
    const wrapper = mountProperty();

    expect(wrapper.find('LoadingSpinner')).toHaveLength(1);
    expect(appProvidersMock.listingsProvider.loadFullListingDetails).toHaveBeenCalledWith('' + propertyMock.id);
    appStoreMock.listingStore.get.mockReturnValue(propertyMock);

    // this depends on ComponentDidMount + rerender after state.isLoading was changed
    return flushPromises().then(() => {
      expect(appStoreMock.editedListingStore.loadListing).toHaveBeenCalledWith(propertyMock);
      wrapper.update();
      expect(wrapper.find('LoadingSpinner')).toHaveLength(0);
    });
  });
});
