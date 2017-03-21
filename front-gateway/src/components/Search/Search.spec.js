'use strict';
import { shallow } from 'enzyme';
import React from 'react';

import Search from './Search';
import ListingThumbnail from '../ListingThumbnail/ListingThumbnail';

describe('Search', () => {
  let appProvidersMock;
  let appStoreMock;
  let mockResults;

  beforeEach(() => {
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
        searchResults: jest.fn().mockReturnValue([mockResults])
      },
      cityStore: {
        cities: []
      },
      metaData: {
        title: 'should change'
      }
    };
    appProvidersMock = {
      likeProvider: {
        getAllUserLikes: jest.fn()
      },
      searchProvider: {
        loadNextPage: jest.fn()
      }
    };
  });

  const search = () => shallow(<Search.wrappedComponent appStore={appStoreMock} appProviders={appProvidersMock} />);

  const simulateScroll = (distanceFromBottom) => {
    const wrapper = search();
    wrapper.simulate('scroll', { target: {
      scrollHeight: 1000,
      offsetHeight: 0,
      scrollTop: 1000 - distanceFromBottom
    }});
  };

  it('should render apartment from store', () => {
    const wrapper = search();

    const thumbnails = wrapper.find(ListingThumbnail);
    expect(thumbnails.length).toBe(appStoreMock.searchStore.searchResults().length);
    const firstThumbnail = thumbnails.at(0);
    expect(firstThumbnail.prop('listing')).toBe(mockResults);
  });

  it('should set title in metadata', () => {
    search();
    expect(appStoreMock.metaData.title).not.toBe('should change');
  });

  it('should call loadNextPage when scrolling down', () => {
    appStoreMock.searchStore.hasMorePages = true;
    simulateScroll(850);
    expect(appProvidersMock.searchProvider.loadNextPage).toHaveBeenCalled();
  });

  it('should not call loadNextPage when not scrolled enough', () => {
    appStoreMock.searchStore.hasMorePages = true;
    simulateScroll(950);
    expect(appProvidersMock.searchProvider.loadNextPage).not.toHaveBeenCalled();
  });

  it('should not call loadNextPage when not no more pages', () => {
    appStoreMock.searchStore.hasMorePages = false;
    simulateScroll(100);
    expect(appProvidersMock.searchProvider.loadNextPage).not.toHaveBeenCalled();
  });
});
