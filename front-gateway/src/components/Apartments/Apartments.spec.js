'use strict';
import { shallow } from 'enzyme';
import React from 'react';

import Apartments from './Apartments';
import NavLink from '../NavLink';

describe('Apartments', function () {

  beforeAll(function () {
    this.mockApartment = { id: 1, title: 'mock apartment' };
    this.appStoreMock = {
      apartmentStore: {
        apartments: [ this.mockApartment ]
      }
    };
    this.appProvidersMock = {};
  });

  it('should render apartment from store', function () {
    const wrapper = shallow(<Apartments.wrappedComponent appStore={this.appStoreMock} appProviders={this.appProvidersMock} />);

    const links = wrapper.find(NavLink);
    expect(links.length).toBe(this.appStoreMock.apartmentStore.apartments.length);
    const firstLink = links.at(0);
    expect(firstLink.prop('to')).toBe('/apartments/' + this.mockApartment.id);
    expect(firstLink.children().text()).toBe(this.mockApartment.title);
  });

});

