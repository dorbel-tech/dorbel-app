import React from 'react';
import { shallow } from 'enzyme';

import OHEList from './OHEList';

describe('OHE List', () => {
  let appStoreMock, appProvidersMock, listingMock;

  beforeEach(() => {
    appStoreMock = {
      oheStore: {
        oheByListingId: jest.fn()
      },
      listingStore: {
        isListingPublisherOrAdmin: jest.fn()
      }
    };
    listingMock = { id: 13 };
  });

  const ohelist = () => shallow(<OHEList.wrappedComponent appStore={appStoreMock} appProviders={appProvidersMock} router={{}} listing={listingMock} />);

  it('should show loader when no ohes loaded', () => {
    appStoreMock.oheStore.oheByListingId.mockReturnValue(undefined);
    expect(ohelist().find('LoadingSpinner')).toHaveLength(1);
  });

  it('should render list when ohes are loaded', () => {
    listingMock.status = 'listed';
    appStoreMock.oheStore.oheByListingId.mockReturnValue([
      { id: 1, status: 'open' },
      { id: 2, status: 'open' }
    ]);
    const wrapper = ohelist();
    const oheItems = wrapper.find('a.list-group-item');

    expect(oheItems).toHaveLength(2);
    oheItems.forEach(item => expect(item.text()).toMatch('הרשמו לביקור'));
  });
});
