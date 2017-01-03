import React, { Component } from 'react';
import { observer } from 'mobx-react';
import NavLink from '~/components/NavLink';

@observer(['appStore', 'appProviders'])
class Listings extends Component {
  componentDidMount() {
    this.props.appProviders.listingsProvider.loadListings();
  }

  render() {
    const { listingStore } = this.props.appStore;

    return (
      <div>
        <h2>Apartments</h2>
        <ul>
          {
            listingStore.listings.map(listing =>
              <li key={listing.id}>
                <NavLink to={'/apartments/' + listing.id}>
                  {listing.apartment.building.street_name} {listing.apartment.building.house_number} - {listing.apartment.apt_number}
                </NavLink>
              </li>
            )}
        </ul>
        {this.props.children}
      </div>
    );
  }
}

Listings.wrappedComponent.propTypes = {
  children: React.PropTypes.node,
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired
};

export default Listings;
