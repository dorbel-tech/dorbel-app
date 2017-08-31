import React from 'react';
import { shallow } from 'enzyme';

import ListingStatusSelector from './ListingStatusSelector';

describe('Listing Status Selector', () => {
  let appStoreMock, appProvidersMock, listingMock;

  beforeEach(() => {
    appProvidersMock = {
      listingsProvider: {
        isRepublishable: jest.fn(),
        republish: jest.fn(),
        updateListingStatus: jest.fn()
      }
    };
    listingMock = {
      status: 'rented'
    };
  });

  const listingStatusSelector = () => shallow(<ListingStatusSelector.wrappedComponent appProviders={appProvidersMock} appStore={appStoreMock} listing={listingMock} />);

  it('should show republish link when the listing is republishable', () => {
    appProvidersMock.listingsProvider.isRepublishable.mockReturnValue(true);
    const wrapper = listingStatusSelector();
    expect(wrapper.findWhere(n => n.text() === 'פרסום הנכס מחדש')).toHaveLength(1);
  });

  it('should NOT show republish link when the listing is NOT republishable', () => {
    appProvidersMock.listingsProvider.isRepublishable.mockReturnValue(false);
    const wrapper = listingStatusSelector();
    expect(wrapper.findWhere(n => n.text() === 'פרסום הנכס מחדש')).toHaveLength(0);
  });

  it('should call provider.republish when clicking on the republish link and not change status', () => {
    appProvidersMock.listingsProvider.isRepublishable.mockReturnValue(true);
    const wrapper = listingStatusSelector();
    wrapper.instance().changeStatus('republish'); // onClick is hidden deep down in DropdownButton so we invoke directly
    expect(appProvidersMock.listingsProvider.republish).toHaveBeenCalledWith(listingMock);
    expect(appProvidersMock.listingsProvider.updateListingStatus).not.toHaveBeenCalled();
  });
});
