'use strict';
import { shallow } from 'enzyme';
import React from 'react';

import Search from './Search';

describe('Search', () => {
  let appProvidersMock;
  let appStoreMock;

  beforeEach(() => {
    appStoreMock = {
      authStore: {},
      metaData: {
        title: 'should change'
      }
    };
    appProvidersMock = {
      likeProvider: {
        getAllUserLikes: jest.fn()
      }
    };
  });

  const search = () => shallow(<Search.wrappedComponent appStore={appStoreMock} appProviders={appProvidersMock} />);

  it('should set title in metadata', () => {
    search();
    expect(appStoreMock.metaData.title).not.toBe('should change');
  });
});
