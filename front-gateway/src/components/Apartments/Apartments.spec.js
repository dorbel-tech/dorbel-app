'use strict';
import { shallow } from 'enzyme';
import React from 'react';

import Apartments from './Apartments';
import ListingThumbnail from '../ListingThumbnail/ListingThumbnail';

describe('Apartments', function () {
  beforeAll(function () {
    this.mockApartment = {
      id: 1,
      apartment: {
        id: 1,
        apt_number: 'h',
        building: {
          street_name: 'mock street', house_number: '3s',
        }
      }
    };

    this.appStoreMock = {
      listingStore: {
        apartments: [this.mockApartment]
      },
      cityStore: {
        cities: []
      }
    };
    this.appProvidersMock = {};
  });

  it('should render apartment from store', function () {
    const wrapper = shallow(<Apartments.wrappedComponent appStore={this.appStoreMock} appProviders={this.appProvidersMock} />);

    const thumbnails = wrapper.find(ListingThumbnail);
    expect(thumbnails.length).toBe(this.appStoreMock.listingStore.apartments.length);
    const firstThumbnail = thumbnails.at(0);
    expect(firstThumbnail.prop('listing')).toBe(this.mockApartment);
  });
});
