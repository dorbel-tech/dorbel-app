import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';

import TenantRow from '~/components/Tenants/TenantRow/TenantRow';
import TenantProfile from '~/components/Tenants/TenantProfile/TenantProfile';

describe('Tenant Row', () => {
  let appProvidersMock;

  beforeEach(() => {
    appProvidersMock = {
      modalProvider: {
        showInfoModal: jest.fn()
      }
    };
  });

  const tenantRow = (tenant) => shallow(<TenantRow.wrappedComponent tenant={tenant} appProviders={appProvidersMock} />);

  it('should show tenant first name and last name', () => {
    const tenant = { first_name: faker.name.firstName(), last_name: faker.name.lastName() };
    const wrapper = tenantRow(tenant);
    expect(wrapper.find('span').text()).toBe(`${tenant.first_name} ${tenant.last_name}`);
  });

  it('should show tenant profile when clicking on row', () => {
    const wrapper = tenantRow({ first_name: faker.name.firstName() });
    wrapper.find('Col').first().simulate('click');

    expect(appProvidersMock.modalProvider.showInfoModal.mock.calls[0][0].body.type).toBe(TenantProfile);
  });
});
