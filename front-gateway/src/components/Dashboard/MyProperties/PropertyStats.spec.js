import React from 'react';
import { shallow } from 'enzyme';

import PropertyStats from './PropertyStats';

describe('Property Stats', () => {
  let appStoreMock, appProvidersMock, listingMock;

  beforeEach(() => {
    appStoreMock = {
      oheStore: {
        oheByListingId: jest.fn(),
        followersByListingId: {
          get: jest.fn()
        }
      },
      listingStore: {
        listingViewsById: {
          get: jest.fn()
        }
      }
    };
    appProvidersMock = {};
    listingMock = {
      id: 7
    };
  });

  const propertyStats = () => shallow(<PropertyStats.wrappedComponent appStore={appStoreMock} appProviders={appProvidersMock} listing={listingMock} followers={7}/>);
  const getRegistrations = wrapper => wrapper.find('.property-stats-number').at(1).childAt(0).node.props.children;

  it('should display total number of ohe registrations', () => {
    const ohes = [
      { registrations: new Array(7) },
      { registrations: new Array(3) },
      { }
    ];
    appStoreMock.oheStore.oheByListingId.mockReturnValue(ohes);
    const wrapper = propertyStats();
    expect(getRegistrations(wrapper)).toBe(10);
  });

  it('should display 0 registrations if open house events are not loaded', () => {
    appStoreMock.oheStore.oheByListingId.mockReturnValue(undefined);
    const wrapper = propertyStats();
    expect(getRegistrations(wrapper)).toBe(0);
  });
});
