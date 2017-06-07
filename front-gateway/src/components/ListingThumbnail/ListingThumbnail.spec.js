'use strict';
import React from 'react';
import { shallow } from 'enzyme';

import ListingThumbnail from './ListingThumbnail';

describe('Listing Thumbnail', () => {
  let appStoreMock;
  let listing;

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

  beforeEach(() => {
    listing = {
      id: 777,
      images: [],
      apartment: {
        building: {
          neighborhood: {},
          city: {}
        }
      }
    };
  });

  const renderThumbnail = () => {
    const rendered = shallow(<ListingThumbnail.wrappedComponent appStore={appStoreMock} listing={listing} />);
    return rendered.children().children(); // ListingThumbnail contains a Col which contains a NavLink
  }

  describe('Listing lease start', () => {
    it('should display appropriate text for lease_start in the past', () => {
      listing.lease_start = "1-1-1990";

      const rendered = renderThumbnail();

      const leaseStart = rendered.find('.apt-thumb-lease-immediate');
      expect(leaseStart.text()).toBe('מיידי');
    });
    it('should display appropriate text for lease_start which is today', () => {
      listing.lease_start = (new Date()).toDateString();

      const rendered = renderThumbnail();

      const leaseStart = rendered.find('.apt-thumb-lease-immediate');
      expect(leaseStart.text()).toBe('מיידי');
    });
  });

  describe('OHE indication', () => {
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
      expect(oheIndication.exists()).toBe(true);
      expect(oheIndication.text()).toBe('אין מועדי ביקור');
      expect(oheIndication).toMatchSnapshot();
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
