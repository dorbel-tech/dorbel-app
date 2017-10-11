import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import NavLink from '~/components/NavLink';
import { getDashMyPropsPath } from '~/routesHelper';

@inject('appStore') @observer
class ListingHighlight extends React.Component {
  render() {
    const { appStore, listing } = this.props;
    const isListingPublisherOrAdmin = listing ? appStore.listingStore.isListingPublisherOrAdmin(listing) : false;

    return (
      <div className="listing-highlight-container">
        <div className="pull-right">
          <span className="listing-highlight-price">{listing.monthly_rent}</span>
          <span> ₪ / לחודש</span>
        </div>
        <div className="pull-left">
          {isListingPublisherOrAdmin ?
            <NavLink className="listing-header-to-dashboard" title="לחץ כאן לניהול הנכס"
              to={getDashMyPropsPath(listing)}>
              לניהול הנכס
            </NavLink>
            : null}
        </div>
      </div>
    );
  }
}

ListingHighlight.propTypes = {
  listing: PropTypes.object.isRequired,
  appStore: PropTypes.object
};

export default ListingHighlight;
