import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Col, Grid, Row } from 'react-bootstrap';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import CloudinaryImage from '../CloudinaryImage/CloudinaryImage';
import ListingStatusSelector from '../Listing/components/ListingStatusSelector';
import utils from '~/providers/utils';

import './Property.scss';

@observer(['appStore', 'appProviders', 'router'])
class Property extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = { isLoading: false };
  }

  static serverPreRender(props) {
    return props.appProviders.listingsProvider.loadFullListingDetails(props.propertyId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.propertyId != nextProps.propertyId) {
      this.props = nextProps;
      this.loadFullListingDetails();
    }
  }

  componentWillMount() {
    this.loadFullListingDetails();
  }

  loadFullListingDetails() {
    let propertyId = this.props.propertyId;
    if (!this.props.appStore.listingStore.get(propertyId)) {
      this.setState({ isLoading: true });
      this.props.appProviders.listingsProvider.loadFullListingDetails(propertyId)
        .then(() => this.setState({ isLoading: false }));
    }
  }

  render() {
    const { appStore } = this.props;
    const listing = appStore.listingStore.get(this.props.propertyId);
    const sortedListingImages = utils.sortListingImages(listing);
    const imageURL = sortedListingImages.length ? sortedListingImages[0].url : '';

    if (this.state.isLoading) {
      return (
        <div className="loader-container">
          <LoadingSpinner />
        </div>
      );
    }

    return  <Grid fluid className="property-wrapper">
              <Row>
                <Col xs={4} className="property-image-container">
                  <CloudinaryImage src={imageURL} height={97} className="property-image"/>
                  <ListingStatusSelector listing={listing} />
                </Col>
                <Col xs={5} className="property-title-container">
                  <div className="property-title">
                    {utils.getListingTitle(listing)}
                  </div>
                  <div className="property-title-details">
                    <span>
                      {listing.apartment.rooms}</span>
                      <span className="property-title-details-sub-text"> חדרים</span>
                    <span>
                      {listing.apartment.size}</span>
                      <span className="property-title-details-sub-text"> מ"ר</span>
                    <span>
                      <span className="property-title-details-sub-text">קומה</span>
                      {utils.getFloorLabel(listing, true)}</span>
                  </div>
                </Col>
                <Col xs={3} className="property-actions-container">

                </Col>
              </Row>
            </Grid>;
  }
}

Property.wrappedComponent.propTypes = {
  propertyId: React.PropTypes.string.isRequired,
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
  router: React.PropTypes.object
};

export default Property;
