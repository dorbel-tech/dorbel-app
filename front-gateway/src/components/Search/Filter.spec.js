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
  }

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

  describe('Initialization', () => {
    it('should initialize the component', () => {
      filter();

      expect(props.appProviders.searchProvider.initFilter).toHaveBeenCalledWith();
      expect(props.appProviders.cityProvider.loadCities).toHaveBeenCalledWith();
      expect(props.appProviders.searchProvider.search).toHaveBeenCalledWith({"city": 1});
      expect(mountedFilter.state()).toBeNull();
    });

    it('should initialize the component with state from location', () => {
      spyOn(JSON, 'parse').and.returnValue({room: true});
      filter();

      expect(mountedFilter.state()).toBeNull();
    });
  });
});
