'use strict';
import { shallow } from 'enzyme';
import React from 'react';

import Search from './Search';
import ListingThumbnail from '../ListingThumbnail/ListingThumbnail';

describe('Search', () => {
  let appProvidersMock;
  let appStoreMock;
  let mockResults;

  beforeAll(() => {
    mockResults = {
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
      searchStore: {
        searchResults: [mockResults]
      },
      cityStore: {
        cities: []
      },
      metaData: {
        title: 'should change'
      }
    };
    appProvidersMock = {};
  });

  it('should render apartment from store', () => {
    const wrapper = shallow(<Search.wrappedComponent appStore={appStoreMock} appProviders={appProvidersMock} />);

    const thumbnails = wrapper.find(ListingThumbnail);
    expect(thumbnails.length).toBe(appStoreMock.searchStore.searchResults.length);
    const firstThumbnail = thumbnails.at(0);
    expect(firstThumbnail.prop('listing')).toBe(mockResults);
  });

  it('should set title in metadata', () => {
    shallow(<Search.wrappedComponent appStore={appStoreMock} appProviders={appProvidersMock} />);
    expect(appStoreMock.metaData.title).not.toBe('should change');
  });
});
