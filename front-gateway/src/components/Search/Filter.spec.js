'use strict';
import { mount, shallow } from 'enzyme';
import React from 'react';
import Filter from './Filter';

describe('Filter', () => {
  let props;
  let mountedFilter;

  const filter = () => {
    if (!mountedFilter) {
      mountedFilter = mount(
        <Filter.WrappedComponent {...props} />
      );
    }
    return mountedFilter;
  };

  const shallowFilter = () => shallow(<Filter.WrappedComponent {...props} />);

  const saveFilterButton = () => mountedFilter.find('#saveFilterButton');

  beforeEach(() => {
    spyOn(history, 'pushState');

    props = {
      appStore: {
        authStore: {
          isUserAdmin: jest.fn()
        },
        searchStore: {}
      },
      appProviders: {
        authProvider: {
          shouldLogin: jest.fn().mockReturnValue(true)
        },
        searchProvider: {
          search: jest.fn().mockReturnValue(Promise.resolve([])),
          resetActiveFilter: jest.fn(),
          saveFilter: jest.fn().mockReturnValue(Promise.resolve())
        },
        oheProvider: {
          loadListingEvents: jest.fn()
        }
      },
      data: {
        cities: []
      },
      client: {
        query: jest.fn().mockReturnValue(Promise.resolve())
      }
    };
    mountedFilter = undefined;
  });

  it('should initialize correctly', () => {
    const expectedFilterObj = {};

    filter();

    expect(props.client.query).not.toHaveBeenCalled();
    expect(history.pushState).toHaveBeenCalledWith(expectedFilterObj, '', jasmine.any(String));
    expect(history.pushState.calls.count()).toEqual(1);
    expect(props.appProviders.searchProvider.search).toHaveBeenCalledWith(expectedFilterObj);
    expect(props.appProviders.searchProvider.search.mock.calls.length).toEqual(1);
  });

  it('should match snapshot in initial state', () => {
    expect(shallowFilter()).toMatchSnapshot();
  });

  it('should initialize with parsed filter object', () => {
    const expectedFilterObj = {city: 2};
    spyOn(JSON, 'parse').and.returnValue(expectedFilterObj);

    filter();

    expect(props.client.query.mock.calls[0][0].variables.city_id).toBe(expectedFilterObj.city);
    expect(props.appProviders.searchProvider.search).toHaveBeenCalledWith(expectedFilterObj);
    expect(history.pushState).toHaveBeenCalledWith(expectedFilterObj, '', jasmine.any(String));
    expect(history.pushState.calls.count()).toEqual(1);
    expect(props.appProviders.searchProvider.search).toHaveBeenCalledWith(expectedFilterObj);
    expect(props.appProviders.searchProvider.search.mock.calls.length).toEqual(1);
  });

  it('should reset active filter on load', () => {
    filter();
    expect(props.appProviders.searchProvider.resetActiveFilter).toHaveBeenCalled();
  });

  it('should check for login when clicking on save filter', () => {
    filter();
    saveFilterButton().simulate('click');
    expect(props.appProviders.authProvider.shouldLogin).toHaveBeenCalled();
  });

  it('should save filter when logged in and clicking on save filter', () => {
    const mockFilter = { city: 2 };
    spyOn(JSON, 'parse').and.returnValue(mockFilter);
    props.appProviders.authProvider.shouldLogin.mockReturnValue(false);

    filter();
    saveFilterButton().simulate('click');

    expect(props.appProviders.searchProvider.saveFilter).toHaveBeenCalledWith(mockFilter);
  });

  it('should change save filter button text when filter is selected', () => {
    props.appStore.searchStore.activeFilterId = 2;
    filter();
    expect(saveFilterButton().text()).toEqual('עדכן חיפוש');
  });
});
