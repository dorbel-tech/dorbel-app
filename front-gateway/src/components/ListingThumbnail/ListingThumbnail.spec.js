'use strict';
import React from 'react';
import { shallow } from 'enzyme';

import ListingThumbnail from './ListingThumbnail';

describe('Listing Thumbnail', () => {
  let appStoreMock;

  beforeAll(() => {
    appStoreMock = {
      oheStore: {
        isListingLoaded: jest.fn(),
        oheByListingId: jest.fn().mockReturnValue([])
      },
      authStore: {
        isLoggedIn: () => false
      }
    };
  });

  describe('OHE indication', () => {
    function renderThumbnail() {
      const listing = {
        id: 777,
        images: [],
        apartment: {
          building: {
            neighborhood: {},
            city: {}
          }
        }
      };

      const rendered = shallow(<ListingThumbnail.wrappedComponent appStore={appStoreMock} listing={listing} />);
      return rendered.children().children(); // ListingThumbnail contains a Col which contains a NavLink
    }

    it('should display OHEs when they are already loaded', () => {
      const oheCount = 7;
      appStoreMock.oheStore.isListingLoaded.mockReturnValue(true);
      appStoreMock.oheStore.oheByListingId.mockReturnValue(Array(oheCount).fill({ status: 'open' }));

      const rendered = renderThumbnail();

      const oheIndication = rendered.find('.apt-thumb-ohe-text');
      expect(oheIndication.exists()).toBe(true);
      expect(oheIndication.text()).toBe(`${oheCount} מועדי ביקור זמינים`);
      expect(oheIndication).toMatchSnapshot();
    });

    it('should only display indication for open or registered OHEs', () => {
      const openCount = 3;
      const registeredCount = 2;
      const closedCount = 4;
      appStoreMock.oheStore.isListingLoaded.mockReturnValue(true);
      appStoreMock.oheStore.oheByListingId.mockReturnValue([].concat(
        Array(openCount).fill({ status: 'open' }),
        Array(closedCount).fill({ status: 'not open' }),
        Array(registeredCount).fill({ status: 'registered' })
      ));

      const rendered = renderThumbnail();

      const oheIndication = rendered.find('.apt-thumb-ohe-text');
      expect(oheIndication.exists()).toBe(true);
      expect(oheIndication.text()).toBe(`${openCount + registeredCount} מועדי ביקור זמינים`);
      expect(oheIndication).toMatchSnapshot();
    });

    it('should display indication for a loaded listing with no events', () => {
      appStoreMock.oheStore.isListingLoaded.mockReturnValue(true);
      appStoreMock.oheStore.oheByListingId.mockReturnValue([]);

      const rendered = renderThumbnail();

      const oheIndication = rendered.find('.apt-thumb-no-ohe');
      const oheLink = rendered.find('.apt-thumb-ohe-text');
      expect(oheIndication.exists()).toBe(true);
      expect(oheIndication.text()).toBe('אין מועדי ביקור');
      expect(oheIndication).toMatchSnapshot();
      expect(oheLink.exists()).toBe(true);
      expect(oheLink.text()).toBe('עדכנו אותי');
      expect(oheLink).toMatchSnapshot();
    });

    it('should not render anything when listing events are not loaded', () => {
      appStoreMock.oheStore.isListingLoaded.mockReturnValue(false);

      const rendered = renderThumbnail();

      const noOheIndication = rendered.find('.apt-thumb-no-ohe');
      const oheIndication = rendered.find('.apt-thumb-ohe-text');
      expect(noOheIndication.exists()).toBe(false);
      expect(oheIndication.exists()).toBe(false);
    });
  });
});
