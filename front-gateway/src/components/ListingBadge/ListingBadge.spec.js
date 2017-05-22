import React from 'react';
import { shallow } from 'enzyme';

import ListingBadge from './ListingBadge';
import utils from '~/providers/utils';

describe('Search', () => {
  let appStoreMock, listingMock;

  beforeEach(() => {
    appStoreMock = {};
    listingMock = {};
  });

  const listingBadge = () => shallow(<ListingBadge.wrappedComponent appStore={appStoreMock} listing={listingMock} />);

  it('should take status label from util labels', () => {
    listingMock.status = 'rented';
    const wrapper = listingBadge();
    expect(wrapper.find('span').text()).toEqual(utils.getListingStatusLabels()[listingMock.status].label);
  });
});
