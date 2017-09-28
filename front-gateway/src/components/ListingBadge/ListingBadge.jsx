'use strict';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import utils from '../../providers/utils';
import './ListingBadge.scss';

@inject('appStore') @observer
class ListingBadge extends Component {

  getBadgeData() {
    const { listing } = this.props;

    const options = {
      show: false,
      className: '',
      text: '',
    };

    let listingStatus = listing.status;
    const listingStatusLabels = utils.getListingStatusLabels();

    if (listingStatus != 'listed') {
      options.className = listingStatus;

      const listingStatusLabel = listingStatusLabels[listingStatus];
      if (listingStatusLabel) {
        options.show = true;
        options.text = listingStatusLabel.label;
      }
    }
    else if (this.props.listing.roommate_needed) {
      options.show = true;
      options.className = 'roommates';
      options.text = 'שותפים';
    }

    return options;
  }

  render() {
    const badgeData = this.getBadgeData();
    if (badgeData.show) {
      return (
        <div className={'listingBadge ' + badgeData.className}>
          <span className="badgeText">{badgeData.text}</span>
        </div>
      );
    } else {
      return null;
    }
  }
}

ListingBadge.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired
};

export default ListingBadge;
