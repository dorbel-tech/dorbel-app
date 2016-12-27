'use strict';
import { shallow } from 'enzyme';
import React from 'react';

import Apartments from './Apartments';
import NavLink from '../NavLink';

describe('Apartments', function () {

  beforeAll(function () {
    this.mockApartment = { id: 1, street_name: 'mock street', house_number: '3s', apt_number: 'h' };
    this.appStoreMock = {
      listingStore: {
        apartments: [ this.mockApartment ]
      }
    };
    this.appProvidersMock = {};
  });

  it('should render apartment from store', function () {
    const wrapper = shallow(<Apartments.wrappedComponent appStore={this.appStoreMock} appProviders={this.appProvidersMock} />);

    const links = wrapper.find(NavLink);
    expect(links.length).toBe(this.appStoreMock.listingStore.apartments.length);
    const firstLink = links.at(0);
    expect(firstLink.prop('to')).toBe('/apartments/' + this.mockApartment.id);
    expect(firstLink.children().nodes.join('')).toBe(`${this.mockApartment.street_name} ${this.mockApartment.house_number} - ${this.mockApartment.apt_number}`);
  });

});

