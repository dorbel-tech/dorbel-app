import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Button, Col, Grid, Row } from 'react-bootstrap';
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

  previewButtonClickHandler() {
    const { appStore } = this.props;
    const listing = appStore.listingStore.get(this.props.propertyId);
    const previewRoute = '/apartments/' + (listing ? listing.id : '');

    this.props.router.setRoute(previewRoute);
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
              <Row className="property-top-container">
                <Col md={4} sm={3} xs={5} className="property-image-container">
                  <CloudinaryImage src={imageURL} height={97} className="property-image"/>
                  <ListingStatusSelector listing={listing} />
                </Col>
                <Col md={5} sm={6} xs={7} className="property-title-container">
                  <div className="property-title">
                    {utils.getListingTitle(listing)}
                  </div>
                  <div className="property-title-details">
                    <span>
                      {listing.apartment.rooms}</span>
                      <span className="property-title-details-sub-text"> חדרים</span>
                    <div className="property-title-details-vr" />
                    <span>
                      {listing.apartment.size}</span>
                      <span className="property-title-details-sub-text"> מ"ר</span>
                    <div className="property-title-details-vr" />
                    <span>
                      <span className="property-title-details-sub-text property-title-details-last-text">קומה</span>
                      {utils.getFloorLabel(listing, true)}</span>
                  </div>
                </Col>
                <Col sm={3} className="property-actions-container">
                  <div className="property-actions-details">
                    <div>
                      <span className="property-actions-title">
                        {listing.apartment.rooms}</span><br/>
                        <span className="property-actions-sub-title">עוקבים</span>
                    </div>
                    <div className="property-actions-vr" />
                    <div>
                      <span className="property-actions-title">
                        {listing.apartment.size}</span><br/>
                        <span className="property-actions-sub-title">לייקים</span>
                    </div>
                  </div>
                  <div>
                    <div className="property-actions-preview-container">
                      <Button className="property-preview-button"
                              onClick={this.previewButtonClickHandler}>צפה</Button>
                    </div>
                    <div className="property-actions-menu-container">
                      <i className="fa fa-bars" aria-hidden="true"></i>
                    </div>
                  </div>
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
