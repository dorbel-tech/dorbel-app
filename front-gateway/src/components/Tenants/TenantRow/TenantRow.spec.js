import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';

import utils from '~/providers/utils';
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

  const tenantRow = (tenant, listingTitle) => shallow(<TenantRow.wrappedComponent tenant={tenant} listingTitle={listingTitle || 'Listing Title'} appProviders={appProvidersMock} />);

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

  it('should show disabled tenant row', () => {
    const wrapper = tenantRow({ disabled: true });
    wrapper.find('Col').first().simulate('click');

    expect(appProvidersMock.modalProvider.showInfoModal).not.toHaveBeenCalled();
  });

  it('should show disabled tenant row', () => {
    const tenant = { dorbel_user_id: faker.random.uuid(), listing_id: faker.random.number(), first_name: faker.name.firstName(), email: faker.internet.email() };
    const listingTitle = faker.name.title();
    const conversationMock = jest.fn();
    const popupMock = {mount: jest.fn()};
    appProvidersMock.messagingProvider = {
      getOrStartConversation: jest.fn().mockReturnValue(conversationMock),
      talkSession: {createPopup: jest.fn().mockReturnValue(popupMock)}
    }
    utils.hideIntercom = jest.fn();
    let callbacks = [];
    global.window.Talk = {ready: {then: (f) => callbacks.push(f)}};

    const wrapper = tenantRow(tenant, listingTitle);
    wrapper.find('.tenant-row-msg-icon').simulate('click');

    expect(callbacks.length).toEqual(1);
    callbacks[0]();

    expect(appProvidersMock.messagingProvider.getOrStartConversation).toHaveBeenCalledWith(
      {
        id: tenant.dorbel_user_id,
        name: tenant.first_name,
        email: tenant.email,
        configuration: 'general',
        welcomeMessage: 'באפשרותך לשלוח הודעה לדיירים. במידה והם אינם מחוברים הודעתך תישלח אליהם למייל.'
      },
      {
        topicId: tenant.listing_id,
        subject: listingTitle
      }
    );
    expect(appProvidersMock.messagingProvider.talkSession.createPopup).toHaveBeenCalledWith(
      conversationMock
    );
    expect(popupMock.mount).toHaveBeenCalledWith();
    expect(utils.hideIntercom).toHaveBeenCalledWith(true);
  });
});
