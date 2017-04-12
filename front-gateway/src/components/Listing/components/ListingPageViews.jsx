'use strict';
import React from 'react';
import { inject, observer } from 'mobx-react';
import ReactTooltip from 'react-tooltip';

@inject('appStore', 'appProviders', 'router') @observer
class ListingPageViews extends React.Component {
  componentDidMount() {
    const { listing, appStore, appProviders } = this.props;
    if (!appStore.listingStore.listingViewsById.has(listing.id)) {
      appProviders.listingsProvider.loadListingPageViews(listing.id);
    }
  }

  render() {
    const { appStore, listing } = this.props;

    if (!appStore.listingStore.listingViewsById.has(listing.id)) {
      return null;
    }

    const views = appStore.listingStore.listingViewsById.get(listing.id);

    return (
      <span className="listing-page-views" data-tip="נתון זה מתעדכן אחת לשעה" data-for="pave-views">
        <i className="fa fa-eye"></i>&nbsp; {views} צפיות
        <ReactTooltip type="dark" effect="solid" place="top" id="pave-views"/>
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
