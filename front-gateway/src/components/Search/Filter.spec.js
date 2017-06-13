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
        },
        neighborhoodStore: {
          neighborhoodsByCityId: {
            get: jest.fn()
          }
        }
      },
      appProviders: {
        cityProvider: {loadCities: jest.fn()},
        neighborhoodProvider: {loadNeighborhoodByCityId: jest.fn()},
        searchProvider: {
          search: jest.fn().mockReturnValue(Promise.resolve([]))
        },
        oheProvider: {
          loadListingEvents: jest.fn()
        }
      }
    };
    mountedFilter = undefined;
  });

  it('should initialize correctly', () => {
    const expectedFilterObj = {};

    filter();

    expect(props.appProviders.cityProvider.loadCities).toHaveBeenCalledWith();
    expect(props.appProviders.neighborhoodProvider.loadNeighborhoodByCityId).not.toHaveBeenCalled();
    expect(history.pushState).toHaveBeenCalledWith(expectedFilterObj, '', jasmine.any(String));
    expect(history.pushState.calls.count()).toEqual(1);
    expect(props.appProviders.searchProvider.search).toHaveBeenCalledWith(expectedFilterObj);
    expect(props.appProviders.searchProvider.search.mock.calls.length).toEqual(1);

    expect(mountedFilter).toMatchSnapshot();
  });

  it('should initialize with parsed filter object', () => {
    const expectedFilterObj = {city: 2};
    spyOn(JSON, 'parse').and.returnValue(expectedFilterObj);

    filter();

    expect(props.appProviders.cityProvider.loadCities).toHaveBeenCalledWith();
    expect(props.appProviders.neighborhoodProvider.loadNeighborhoodByCityId).toHaveBeenCalledWith(2);
    expect(props.appProviders.searchProvider.search).toHaveBeenCalledWith(expectedFilterObj);
    expect(history.pushState).toHaveBeenCalledWith(expectedFilterObj, '', jasmine.any(String));
    expect(history.pushState.calls.count()).toEqual(1);
    expect(props.appProviders.searchProvider.search).toHaveBeenCalledWith(expectedFilterObj);
    expect(props.appProviders.searchProvider.search.mock.calls.length).toEqual(1);
  });
});
