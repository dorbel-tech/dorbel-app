'use strict';
import React from 'react';
import { observer } from 'mobx-react';

@observer(['appStore', 'appProviders', 'router'])
class ListingPageViews extends React.Component {

  componentDidMount() {
    const { listing, appStore, appProviders } = this.props;
    if (!appStore.listingStore.listingViewsById.has(listing.id)) {
      appProviders.apartmentsProvider.loadListingPageViews(listing);
    }
  }

  render() {
    const { appStore, listing } = this.props;

    if (!appStore.listingStore.isListingPublisher(listing) ||
        !appStore.listingStore.listingViewsById.has(listing.id)) {
      return null;
    }

    const views = appStore.listingStore.listingViewsById.get(listing.id);

    return (
      <span className="listing-page-views">
        <i className="fa fa-eye"></i> {views} צפיות
      </span>
    );
  }
}

ListingPageViews.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired,
  listing: React.PropTypes.object.isRequired
};

export default ListingPageViews;
