'use strict';
import { shallow } from 'enzyme';
import React from 'react';

import Listings from './Listings';
import NavLink from '../NavLink';

describe('Listings', function () {

  beforeAll(function () {
    this.mockListing = {
      id: 1,
      apartment: {
        building: {
          street_name: 'mock street',
          house_number: '3s',
          apt_number: 'h'
        }
      }
    };

    this.appStoreMock = {
      listingStore: {
        listings: [this.mockListing]
      }
    };
    this.appProvidersMock = {};
  });

  it('should render apartment from store', function () {
    const wrapper = shallow(<Listings.wrappedComponent appStore={this.appStoreMock} appProviders={this.appProvidersMock} />);

    const links = wrapper.find(NavLink);
    expect(links.length).toBe(this.appStoreMock.listingStore.listings.length);
    const firstLink = links.at(0);
    expect(firstLink.prop('to')).toBe('/apartments/' + this.mockListing.id);
    expect(firstLink.children().nodes.join('')).toBe(`${this.mockListing.street_name} ${this.mockListing.house_number} - ${this.mockListing.apt_number}`);
  });

});

