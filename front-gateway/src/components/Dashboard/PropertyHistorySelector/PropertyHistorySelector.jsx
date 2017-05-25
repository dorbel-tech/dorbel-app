import React from 'react';
import autobind from 'react-autobind';
import moment from 'moment';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { getDashMyPropsPath } from '~/routesHelper';

@inject('appStore', 'appProviders', 'router') @observer
export default class PropertyHistorySelector extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  static propTypes = {
    apartment_id: React.PropTypes.number.isRequired,
    listing_id: React.PropTypes.number.isRequired,
    appProviders: React.PropTypes.object.isRequired,
    appStore: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.appProviders.listingsProvider.loadListingsForApartment(this.props.apartment_id);
  }

  getListingTitle(listing, listingIndex) {
    if (listingIndex === 0) {
      return 'תקופה נוכחית';
    } else {
      return <span>
        <i className="fa fa-history">&nbsp;&nbsp;</i>
        { moment(listing.lease_end).format('MM/YYYY') } - { moment(listing.lease_start).format('MM/YYYY') }

      </span>;
    }
  }

  renderListingMenuItem(listing, listingIndex) {
    let active = listing.id === this.props.listing_id;
    let title = this.getListingTitle(listing, listingIndex);
    return <MenuItem key={listingIndex} eventKey={listing} active={active}>{title}</MenuItem>;
  }

  selectListing(listing) {
    this.props.router.setRoute(getDashMyPropsPath(listing));
  }

  render() {
    const listings = this.props.appStore.listingStore.listingsByApartmentId.get(this.props.apartment_id);
    let disabled = true;
    let title = 'טוען...';

    if (listings) {
      const selectedListingIndex = _.findIndex(listings, { id: this.props.listing_id });
      if (selectedListingIndex < 0) {
        // the current listing might not be loaded yet
        disabled = true;
      } else {
        title = this.getListingTitle(listings[selectedListingIndex], selectedListingIndex);
        disabled = listings.length === 1;
      }
    }

    return (
      <DropdownButton bsSize="small" block bsStyle="default" id="property-history-selector"
        title={title} disabled={disabled} onSelect={this.selectListing}>
        { listings && listings.map(this.renderListingMenuItem) }
      </DropdownButton>
    );
  }
}
