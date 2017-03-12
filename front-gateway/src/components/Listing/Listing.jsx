import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Col, Grid, Row } from 'react-bootstrap';
import OHEList from './OHEList.jsx';
import ListingDescription from './ListingDescription.jsx';
import ListingInfo from './ListingInfo.jsx';
import ListingMenu from './ListingMenu.jsx';
import ListingHeader from './ListingHeader.jsx';
import OHEManager from '~/components/OHEManager/OHEManager';
import ApartmentLocation from '../MapWrapper/MapWrapper.jsx';
import RelatedListings from '../RelatedListings/RelatedListings.jsx';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import utils from '../../providers/utils';

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
          <Row >
            <ApartmentLocation geo={geolocation} />
          </Row>
        </Grid>
      );
    }
  }

  render() {
    const { appStore, action } = this.props;
    const listing = appStore.listingStore.get(this.props.listingId);

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
        tabContent = (<OHEManager listing={listing} />);
        break;
      default:
        // TODO : move to a different file
        tabContent = (
          <div>
            <OHEList listing={listing} oheId={this.props.oheId} action={this.props.action} />
            <Grid fluid className="apt-headline-container">
              <Grid>
                <div className="row">
                  <Col md={9}>
                    <h2>{utils.getListingTitle(listing)}</h2>
                  </Col>
                </div>
              </Grid>
            </Grid>
            <Grid fluid className="apt-highlights-container">
              <Grid>
                <Row>
                  <Col lg={9}>
                    <ListingInfo listing={listing} />
                  </Col>
                </Row>
              </Grid>
            </Grid>
            <ListingDescription listing={listing} />
            {this.renderListingLocation(listing.apartment.building.geolocation)}
            <RelatedListings listingId={listing.id} />
          </div>
        );
    }

    return (
      <div>
        <ListingHeader listing={listing} />
        <ListingMenu listing={listing} currentAction={action} />
        {tabContent}
      </div>
    );
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
