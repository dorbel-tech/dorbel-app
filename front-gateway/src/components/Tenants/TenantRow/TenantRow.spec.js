import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';

import utils from '~/providers/utils';
import TenantRow from '~/components/Tenants/TenantRow/TenantRow';
import TenantProfile from '~/components/Tenants/TenantProfile/TenantProfile';

const tenantMock = {
  dorbel_user_id: faker.random.uuid(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  email: faker.internet.email(),
  tenant_profile: {
    position: 'test'
  }
};
const listingMock = {
  id: 1,
  title: 'title',
  apartment: { rooms: 1 }
}

describe.only('Tenant Row', () => {
  let appProvidersMock, clickEventMock;

  beforeEach(() => {
    appProvidersMock = {
      modalProvider: {
        show: jest.fn()
      }
    };

    clickEventMock = {
      stopPropagation: jest.fn()
    }
  });

  const tenantRow = (tenant, listing) => shallow(<TenantRow.wrappedComponent tenant={tenant} listing={listing} appProviders={appProvidersMock} />);

  it('should show tenant first name and last name', () => {
    const wrapper = tenantRow(tenantMock, listingMock);
    expect(wrapper.find('.tenant-row-profile .tenant-row-name').text()).toBe(`${tenantMock.first_name} ${tenantMock.last_name}`);
  });

  it('should show tenant profile when clicking on row', () => {
    const wrapper = tenantRow(tenantMock, listingMock);
    global.window.analytics = { track: jest.fn() };
    wrapper.simulate('click', clickEventMock);

    expect(appProvidersMock.modalProvider.show.mock.calls[0][0].body.type).toBe(TenantProfile);
    expect(clickEventMock.stopPropagation).not.toHaveBeenCalled();
  });

  it('should show disabled tenant row', () => {
    const wrapper = tenantRow({ disabled: true }, listingMock);
    wrapper.simulate('click', clickEventMock);

    expect(appProvidersMock.modalProvider.show).not.toHaveBeenCalled();
    expect(clickEventMock.stopPropagation).not.toHaveBeenCalled();
  });

  describe('TalkJS integration', () => {
    let popupMock;

    beforeEach(() => {
      process.env.TALKJS_PUBLISHABLE_KEY = 'mockTalkJSPublishableKey';

      popupMock = {};

      appProvidersMock.messagingProvider = {
        getOrStartConversation: jest.fn().mockReturnValue(Promise.resolve(popupMock))
      };
    });

    it('should destroy popup and show intercom on unmount', () => {
      popupMock.destroy = jest.fn();
      utils.hideIntercom = jest.fn();
      const wrapper = tenantRow(tenantMock, listingMock);
      wrapper.find('.tenant-row-button').simulate('click', clickEventMock);

      expect(clickEventMock.stopPropagation).toHaveBeenCalledWith();

      return utils.flushPromises().then(() => {
        wrapper.unmount();

        expect(popupMock.destroy).toHaveBeenCalledWith();
        expect(utils.hideIntercom).toHaveBeenCalledWith(false);
      });
    });

    it('should call messagingProvider.getOrStartConversation', () => {
      const wrapper = tenantRow(tenantMock, listingMock);
      wrapper.find('.tenant-row-button').simulate('click', clickEventMock);

      expect(clickEventMock.stopPropagation).toHaveBeenCalledWith();

      expect(appProvidersMock.messagingProvider.getOrStartConversation).toHaveBeenCalledWith(
        {
          id: tenantMock.dorbel_user_id,
          name: tenantMock.first_name,
          email: tenantMock.email,
          welcomeMessage: 'באפשרותך לשלוח הודעה לדיירים עם הפרטים והזמנה לראות דירה. במידה והם אינם מחוברים הודעתך תישלח אליהם למייל.'
        },
        {
          topicId: listingMock.id,
          subject: utils.getListingTitle(listingMock)
        }
      );
    });
  });
});
