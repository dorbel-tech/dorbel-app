import React from 'react';
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
        <div className="float-right">
          <span className="listing-highlight-price">{listing.monthly_rent}</span>
          <span> ₪ / לחודש</span>
        </div>
        <div className="float-left">
          {isListingPublisherOrAdmin ?
            <NavLink className="listing-header-to-dashboard" title="לחץ כאן לניהול הנכס"
                    to={getDashMyPropsPath(listing)}>
              <i className="listing-manage-cog fa fa-cog"></i>לניהול הנכס
            </NavLink>
          : null}
        </div>
      </div>
    );
  }
}

ListingHighlight.propTypes = {
  listing: React.PropTypes.object.isRequired,
  appStore: React.PropTypes.object.isRequired
};

export default ListingHighlight;
