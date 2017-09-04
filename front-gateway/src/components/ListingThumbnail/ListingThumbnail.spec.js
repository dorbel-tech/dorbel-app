'use strict';
import React from 'react';
import { shallow } from 'enzyme';
import utils from '~/providers/utils';

import ListingThumbnail from './ListingThumbnail';

describe('Listing Thumbnail', () => {
  let appStoreMock;
  let listing;

  beforeAll(() => {
    appStoreMock = {
      authStore: {
        isLoggedIn: () => false
      }
    };
  });

  beforeEach(() => {
    listing = {
      id: 777,
      images: [ { url: 'http:bah' }],
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
  };

  describe('Listing lease start', () => {
    it('should display appropriate text for lease_start in the past', () => {
      listing.lease_start = '1-1-1990';

      const rendered = renderThumbnail();

      const leaseStart = rendered.find('.apt-thumb-lease-immediate');
      expect(leaseStart.text()).toBe('מיידי');
    });
    it('should display appropriate text for lease_start which is today', () => {
      listing.lease_start = (new Date()).toISOString();

      const rendered = renderThumbnail();

      const leaseStart = rendered.find('.apt-thumb-lease-immediate');
      expect(leaseStart.text()).toBe('מיידי');
    });
    it('should display appropriate text for lease_start in the future', () => {
      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      listing.lease_start = tomorrow.toISOString();

      const rendered = renderThumbnail();

      const leaseStart = rendered.find('.apt-thumb-lease-date');
      expect(leaseStart.text()).toBe(utils.formatDate(tomorrow));
    });
  });
});
