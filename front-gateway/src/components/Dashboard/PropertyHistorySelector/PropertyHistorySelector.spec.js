import React from 'react';
import { shallow } from 'enzyme';

import PropertyHistorySelector from './PropertyHistorySelector';

describe('Property History Selector', () => {
  let appStoreMock, appProvidersMock, listingMock, routerMock;

  beforeEach(() => {
    appProvidersMock = {};
    appStoreMock = {
      listingStore: {
        listingsByApartmentId: {
          get: jest.fn()
        }
      }
    };
    routerMock = {};
    listingMock = {
      apartment_id: 7,
      id: 4
    };
  });

  const propertyHistorySelector = () => shallow(<PropertyHistorySelector.wrappedComponent
    appProviders={appProvidersMock} appStore={appStoreMock} router={routerMock}
    apartment_id={listingMock.apartment_id} listing_id={listingMock.id} />
  );

  const assertLoadingState = wrapper => {
    const dropdown = wrapper.find('DropdownButton');
    expect(dropdown.prop('disabled')).toBe(true);
    expect(dropdown.prop('title')).toBe('טוען...');
  };

  it('should start in loading state', () => {
    const wrapper = propertyHistorySelector();
    expect(wrapper.find('MenuItem')).toHaveLength(0);
    assertLoadingState(wrapper);
  });

  it('should show loading if current listing has not been loaded to store yet', () => {
    // this happens when going from republish listing directly to manage screen
    // store will return listings - but not the current one
    appStoreMock.listingStore.listingsByApartmentId.get.mockReturnValue([ { id: listingMock.id + 1 }]);
    assertLoadingState(propertyHistorySelector());
  });
});
