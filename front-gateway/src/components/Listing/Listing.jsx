import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Col, Grid, Row } from 'react-bootstrap';
import OHEList from './components/OHEList';
import ListingDescription from './components/ListingDescription';
import ListingHighlight from './components/ListingHighlight';
import ListingHeader from './components/ListingHeader';
import ListingInfo from './components/ListingInfo';
import ListingMenu from './components/ListingMenu';
import ListingSocial from './components/ListingSocial';
import ListingStatusSelector from './components/ListingStatusSelector';
import OHEManager from '~/components/OHEManager/OHEManager';
import ApartmentLocation from '~/components/MapWrapper/MapWrapper';
import RelatedListings from '~/components/RelatedListings/RelatedListings';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import utils from '~/providers/utils';

import './Listing.scss';

@observer(['appStore', 'appProviders', 'router'])
class Listing extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = { isLoading: false };
  }

  static serverPreRender(props) {
    return props.appProviders.listingsProvider.loadFullListingDetails(props.listingId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.listingId != nextProps.listingId) {
      this.props = nextProps;
      this.loadFullListingDetails();
    }
  }

  componentWillMount() {
    this.loadFullListingDetails();
  }

  loadFullListingDetails() {
    let listingId = this.props.listingId;
    if (!this.props.appStore.listingStore.get(listingId)) {
      this.setState({ isLoading: true });
      this.props.appProviders.listingsProvider.loadFullListingDetails(listingId)
        .then(() => this.setState({ isLoading: false }));
    }
  }

  renderListingLocation(geolocation) {
    if (geolocation) {
      return (
        <Grid fluid className="location-container">
          <Row>
            <ApartmentLocation geo={geolocation} />
          </Row>
        </Grid>
      );
    }
  }

  render() {
    const { appStore, action } = this.props;
    const listing = appStore.listingStore.get(this.props.listingId);
    const isListingPublisherOrAdmin = appStore.listingStore.isListingPublisherOrAdmin(listing);

    if (this.state.isLoading) {
      return (
        <div className="loaderContainer">
          <LoadingSpinner />
        </div>
      );
    }

    let tabContent;
    switch (action) {
      case 'events':
        tabContent = <OHEManager listing={listing} />;
        break;
      default:
        // TODO : move to a different file
        tabContent =
          <div>
            {isListingPublisherOrAdmin ?
              <ListingStatusSelector listing={listing} />
            : null}
            <Grid>
              <Row>
                <Col>
                  <h2>{utils.getListingTitle(listing)}</h2>
                </Col>
                <Col>
                  <ListingSocial listing={listing} />
                </Col>
                <Col>
                  <OHEList listing={listing} oheId={this.props.oheId} action={this.props.action} />
                </Col>
              </Row>
              <ListingInfo listing={listing} />
              <ListingDescription listing={listing} />
            </Grid>
            {this.renderListingLocation(listing.apartment.building.geolocation)}
            <RelatedListings listingId={listing.id} />
          </div>;
    }

    return  <div>
              <ListingHeader listing={listing} />
              <ListingHighlight listing={listing} />
              <ListingMenu listing={listing} currentAction={action} />
              {tabContent}
            </div>;
  }
}

Listing.wrappedComponent.propTypes = {
  listingId: React.PropTypes.string.isRequired,
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
  router: React.PropTypes.object,
  oheId: React.PropTypes.string,
  action: React.PropTypes.string
};

export default Listing;
