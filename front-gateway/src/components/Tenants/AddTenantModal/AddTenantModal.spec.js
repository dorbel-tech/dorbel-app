import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';

import AddTenantModal from '~/components/Tenants/AddTenantModal/AddTenantModal';
import { Button } from 'react-bootstrap';

describe('Add Tenant Modal', () => {
  let appProvidersMock;
  beforeEach(() => {
    appProvidersMock = {
      listingsProvider: {
        addTenant: jest.fn()
      },
      modalProvider: {
        close: jest.fn()
      }
    };
  });

  const addTenantModal = (listing_id) => mount(<AddTenantModal.wrappedComponent listing_id={listing_id} appProviders={appProvidersMock} />);

  it('should match snapshot in empty state', () => {
    const listing_id = 58134; // needs to be static for the snapshot
    const wrapper = addTenantModal(listing_id);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not call provider if form is empty', () => {
    const wrapper = mount(<AddTenantModal.wrappedComponent listing_id={faker.random.number()} appProviders={appProvidersMock} />);
    wrapper.find(Button).simulate('click');
    expect(appProvidersMock.listingsProvider.addTenant).not.toHaveBeenCalled();
  });

  it('send form values to provider', () => {
    const listing_id = faker.random.number();
    const wrapper = mount(<AddTenantModal.wrappedComponent listing_id={listing_id} appProviders={appProvidersMock} />);
    const first_name = faker.name.firstName();
    const firstNameInput = wrapper.node.form.formsy.inputs.find(input => input.props.name === 'first_name');
    firstNameInput.setValue(first_name);
    appProvidersMock.listingsProvider.addTenant.mockReturnValue(Promise.resolve());
    wrapper.find(Button).simulate('click');

    const addTenantCallArgs = appProvidersMock.listingsProvider.addTenant.mock.calls[0];
    expect(addTenantCallArgs[0]).toBe(listing_id);
    expect(addTenantCallArgs[1]).toHaveProperty('first_name', first_name);
  });
});
