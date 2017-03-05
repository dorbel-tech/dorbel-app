'use strict';
import { mount } from 'enzyme';
import React from 'react';

import Filter from './Filter';

describe('Filter', () => {
  let props;
  let mountedFilter;

  const filter = () => {
    if (!mountedFilter) {
      mountedFilter = mount(
        <Filter {...props} />
      );
    }
    return mountedFilter;
  };

  beforeEach(() => {
    spyOn(history, 'pushState');

    props = {
      appStore: {
        authStore: {},
        cityStore: {
          cities: []
        }
      },
      appProviders: {
        cityProvider: {loadCities: jest.fn()},
        searchProvider: {
          initFilter: jest.fn(),
          search: jest.fn()
        }
      }
    };
    mountedFilter = undefined;
  });

  it('should initialize correctly', () => {
    const expectedFilterObj = {'city': 1};

    const cityDropdownButton = filter().find('#cityDropdown');

    expect(props.appProviders.searchProvider.initFilter).toHaveBeenCalledWith();
    expect(props.appProviders.cityProvider.loadCities).toHaveBeenCalledWith();
    expect(history.pushState).toHaveBeenCalledWith(expectedFilterObj, '', jasmine.any(String));
    expect(history.pushState.calls.count()).toEqual(1);
    expect(props.appProviders.searchProvider.search).toHaveBeenCalledWith(expectedFilterObj);
    expect(props.appProviders.searchProvider.search.mock.calls.length).toEqual(1);
    expect(cityDropdownButton.text()).toEqual('עיר: טוען... ');
  });

  it('should parse city from location', () => {
    const expectedFilterObj = {'city': 2};
    props.appStore.cityStore.cities = [{id: 2, city_name: 'test2'}];
    spyOn(JSON, 'parse').and.returnValue(expectedFilterObj);

    const cityDropdownButton = filter().find('#cityDropdown');

    expect(props.appProviders.searchProvider.search).toHaveBeenCalledWith(expectedFilterObj);
    expect(cityDropdownButton.text()).toEqual('עיר: test2 ');
  });
});
