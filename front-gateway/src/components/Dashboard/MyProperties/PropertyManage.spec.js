import React from 'react';
import { shallow } from 'enzyme';

import PropertyManage from './PropertyManage';
import TenantRow from '~/components/Tenants/TenantRow/TenantRow';
import AddTenantModal from '~/components/Tenants/AddTenantModal/AddTenantModal';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';

describe('Property Manage Page', () => {
  let appStoreMock, appProvidersMock, listingMock;

  beforeEach(() => {
    appStoreMock = {
      listingStore: {
        listingTenantsById: {
          get: jest.fn()
        }
      }
    };
    appProvidersMock = {
      modalProvider: {
        showInfoModal: jest.fn()
      },
      listingsProvider: {
        isActiveListing: jest.fn()
      }
    };
    listingMock = { id: 8 };
  });

  const propertyManage = () => shallow(<PropertyManage.wrappedComponent appStore={appStoreMock} appProviders={appProvidersMock} listing={listingMock} />);

  it('should render dummy tenant when there are no tenants', () => {
    appStoreMock.listingStore.listingTenantsById.get.mockReturnValue([]);
    const wrapper = propertyManage();
    const tenantRows = wrapper.find(TenantRow);
    expect(tenantRows).toHaveLength(1);
    expect(tenantRows.prop('tenant')).toEqual(TenantRow.getEmptyTenantList()[0]);
  });

  it('should render a list of tenants', () => {
    appStoreMock.listingStore.listingTenantsById.get.mockReturnValue([ { id: 1 }, { id: 2 } ]);
    const wrapper = propertyManage();
    expect(wrapper.find(TenantRow)).toHaveLength(2);
  });

  it('should show loading spinner if no tenant array', () => {
    appStoreMock.listingStore.listingTenantsById.get.mockReturnValue(null);
    const wrapper = propertyManage();
    expect(wrapper.find(TenantRow)).toHaveLength(0);
    expect(wrapper.find(LoadingSpinner)).toHaveLength(1);
  });

  it('should show the add-tenant modal when clicking on the button', () => {
    propertyManage().find('.add-button').simulate('click');
    expect(appProvidersMock.modalProvider.showInfoModal.mock.calls[0][0].body.type).toBe(AddTenantModal);
  });

});
