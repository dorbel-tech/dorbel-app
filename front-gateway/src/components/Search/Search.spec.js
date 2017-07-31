'use strict';
import { shallow } from 'enzyme';
import React from 'react';

import Search from './Search';

describe('Search', () => {
  let props;

  beforeEach(() => {
    props = {
      appStore: {
        authStore: {},
        metaData: {
          title: 'should change'
        }
      },
      appProviders: {
        likeProvider: {
          getAllUserLikes: jest.fn()
        }
      },
      data: {
        loading: false
      }
    };
  });

  const search = () => shallow(<Search.WrappedComponent.wrappedComponent {...props} />);

  it('should set title in metadata', () => {
    search();
    expect(props.appStore.metaData.title).not.toBe('should change');
  });
});
