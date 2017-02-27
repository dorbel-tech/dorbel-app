'use strict';
import { stub } from 'sinon';
require('sinon-as-promised');

import SearchProvider from './SearchProvider';

describe('SearchProvider', () => {
  let searchProvider;
  let appStoreMock;
  let mockSearchResults;
  let apiProviderMock;

  beforeAll(() => {
    mockSearchResults = [123, 456];

    apiProviderMock = {
      fetch: stub().resolves(mockSearchResults)
    };

    appStoreMock = {
      searchStore: {
        searchResults: []
      }
    };

    searchProvider = new SearchProvider(appStoreMock, apiProviderMock);
  });

  it('should call API to load apartments and save them to store', () => {
    return searchProvider.search()
      .then(() => expect(appStoreMock.searchStore.searchResults).toBe(mockSearchResults));
  });
});
