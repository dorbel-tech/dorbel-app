'use strict';

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './ListingBadge.scss';

@observer(['appStore'])
class ListingBadge extends Component {

  getBadgeData() {
    const options = {
      show: false,
      className: '',
      text: '',
    };

    let listingStatus = this.props.listing.status;
    if (listingStatus != 'listed') {
      options.show = true;
      options.className = listingStatus;

      switch (listingStatus) {
        case 'pending':
          options.text = 'ממתינה לאישור';
          break;
        case 'rented':
          options.text = 'מושכרת';
          break;
        case 'unlisted':
          options.text = 'לא פעילה';
          break;
        case 'deleted':
          options.text = 'נמחקה';
          break;
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
