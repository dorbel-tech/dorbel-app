'use strict';
import { shallow } from 'enzyme';
import React from 'react';

import Apartments from './Apartments';
import ListingThumbnail from '../ListingThumbnail/ListingThumbnail';

describe('Apartments', () => {
  let appProvidersMock;
  let appStoreMock;
  let mockApartment;

  beforeAll(() => {
    mockApartment = {
      id: 1,
      apartment: {
        id: 1,
        apt_number: 'h',
        building: {
          street_name: 'mock street', house_number: '3s',
        }
      }
    };

    appStoreMock = {
      authStore: {},
      listingStore: {
        apartments: [mockApartment]
      },
      cityStore: {
        cities: []
      }
    };
    appProvidersMock = {};
  });

  it('should render apartment from store', () => {
    const wrapper = shallow(<Apartments.wrappedComponent appStore={appStoreMock} appProviders={appProvidersMock} />);

    const thumbnails = wrapper.find(ListingThumbnail);
    expect(thumbnails.length).toBe(appStoreMock.listingStore.apartments.length);
    const firstThumbnail = thumbnails.at(0);
    expect(firstThumbnail.prop('listing')).toBe(mockApartment);
  });
});
