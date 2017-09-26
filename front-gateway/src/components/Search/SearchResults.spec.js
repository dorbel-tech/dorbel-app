'use strict';
import { shallow } from 'enzyme';
import React from 'react';

import SearchResults from './SearchResults';
import ListingThumbnail from '../ListingThumbnail/ListingThumbnail';

describe('Search Results', () => {
  let appProvidersMock;
  let appStoreMock;
  let mockResults;
  let noResults;

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
    noResults = (<h1>nothing found</h1>);
    appStoreMock = {
      searchStore: {
        searchResults: jest.fn().mockReturnValue([mockResults])
      }
    };
    appProvidersMock = {
      searchProvider: {
        loadNextPage: jest.fn(),
        setLastScrollTop: jest.fn()
      }
    };
  });

  const searchResults = () => shallow(<SearchResults.wrappedComponent appStore={appStoreMock}
    appProviders={appProvidersMock}
    noResultsContent={noResults} />);

  const simulateScroll = (distanceFromBottom) => {
    const wrapper = searchResults();
    wrapper.simulate('scroll', { target: {
      scrollHeight: 1000,
      offsetHeight: 0,
      scrollTop: 1000 - distanceFromBottom
    }});
  };

  it('should render listing from store', () => {
    const wrapper = searchResults();

    const thumbnails = wrapper.find(ListingThumbnail);
    expect(thumbnails.length).toBe(appStoreMock.searchStore.searchResults().length);
    const firstThumbnail = thumbnails.at(0);
    expect(firstThumbnail.prop('listing')).toBe(mockResults);
  });

  // TODO implement this test
  xit('should set scrollTop correctly for all scrollTargets each componentDidUpdate', () => {
    const scrollKeyMock = jest.fn();
    const wrapper = searchResults();

    wrapper.instance().scrollTargets = [
      {scrollTop: 0},
      {scrollTop: 150},
      {scrollTop: 0}
    ];
    wrapper.instance().scrollKey = scrollKeyMock;

    wrapper.update();

    expect(wrapper.instance().scrollTargets).toBe([
      {scrollTop: 0},
      {scrollTop: 150},
      {scrollTop: 0}
    ]);
  });

  it('should call setLastScrollTop with correct scroll top value when scrolling', () => {
    const scrollKeyMock = jest.fn();
    const wrapper = searchResults();

    wrapper.instance().scrollTargets = [
      {scrollTop: 0},
      {scrollTop: 150},
      {scrollTop: 0}
    ];
    wrapper.instance().scrollKey = scrollKeyMock;

    wrapper.simulate('scroll', { target: {
      scrollHeight: 1000,
      offsetHeight: 0,
      scrollTop: 500
    }});

    expect(appProvidersMock.searchProvider.setLastScrollTop).toHaveBeenCalledWith(150, scrollKeyMock);
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

