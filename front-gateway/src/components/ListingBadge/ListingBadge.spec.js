import React from 'react';
import { shallow } from 'enzyme';

import ListingBadge from './ListingBadge';
import utils from '~/providers/utils';

describe('Search', () => {
  let appStoreMock, listingMock;

  beforeEach(() => {
    appStoreMock = {
      listingStore: {
        isListingPublisherOrAdmin: jest.fn()
      }
    };
    listingMock = {};
  });

  const listingBadge = () => shallow(<ListingBadge.wrappedComponent appStore={appStoreMock} listing={listingMock} />);

  it('should show label matching listing status from util labels', () => {
    listingMock.status = 'rented';
    const wrapper = listingBadge();
    expect(wrapper.find('span').text()).toEqual(utils.getListingStatusLabels()[listingMock.status].label);
  });
  it('should show landlord label matching listing status from util labels', () => {
    appStoreMock.listingStore.isListingPublisherOrAdmin.mockReturnValue(true);
    listingMock.status = 'rented';
    const wrapper = listingBadge();
    expect(wrapper.find('span').text()).toEqual(utils.getListingStatusLabels()[listingMock.status].label);
  });
  it('should not show label for listed listing', () => {
    listingMock.status = 'listed';
    const wrapper = listingBadge();
    expect(wrapper.find('span').length).toEqual(0);
  });
  it('should show roommates label for listed roommates listing', () => {
    listingMock.roommate_needed = true;
    listingMock.status = 'listed';
    const wrapper = listingBadge();
    expect(wrapper.find('span').text()).toEqual('שותפים');
  });
  it('should not show label for listing with non applicable status', () => {
    listingMock.status = 'test';
    const wrapper = listingBadge();
    expect(wrapper.find('span').length).toEqual(0);
  });
});
