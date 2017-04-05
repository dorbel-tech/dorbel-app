import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Button, Col, Grid, Row, OverlayTrigger, Popover } from 'react-bootstrap';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import CloudinaryImage from '../CloudinaryImage/CloudinaryImage';
import ListingStatusSelector from '../Listing/components/ListingStatusSelector';
import PropertyStats from './MyProperties/PropertyStats';
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

  routeClickHandler(e) {
    this.props.router.setRoute(e.target.getAttribute('name'));
  }

  render() {
    const { appStore } = this.props;
    const listing = appStore.listingStore.get(this.props.propertyId);
    const sortedListingImages = utils.sortListingImages(listing);
    const imageURL = sortedListingImages.length ? sortedListingImages[0].url : '';
    const followers = appStore.oheStore.countFollowersByListingId.get(this.props.propertyId);

    const popoverMenu = (
      <Popover id="property-actions-menu" className="property-actions-menu">
        <div name={'/dashboard/my-properties/' + this.props.propertyId + '/edit'} className="property-actions-menu-item" onClick={this.routeClickHandler}>
          <i className="property-actions-menu-item-icon fa fa-pencil-square-o"  aria-hidden="true"></i>
          עריכת פרטי הנכס
        </div>
      </Popover>
    );

    if (this.state.isLoading) {
      return (
        <div className="loader-container">
          <LoadingSpinner />
        </div>
      );
    }

    return  <Grid fluid className="property-wrapper">
              <Row className="property-top-container">
                <Col md={3} sm={3} xs={5} className="property-image-container">
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
                <Col md={4} sm={3} className="property-actions-wrapper">
                  <div className="property-action-container property-actions-details">
                    <div>
                      <span className="property-actions-title">
                        {followers || 0}</span><br/>
                        <span className="property-actions-sub-title">עוקבים</span>
                    </div>
                    <div className="property-actions-vr" />
                    <div>
                      <span className="property-actions-title">
                        {listing.totalLikes || 0}</span><br/>
                        <span className="property-actions-sub-title">לייקים</span>
                    </div>
                  </div>
                  <div className="property-action-container">
                    <div className="property-actions-preview-container">
                      <Button className="property-preview-button"
                              name={'/apartments/' + this.props.propertyId}
                              onClick={this.routeClickHandler}>צפה</Button>
                    </div>
                    <div className="property-actions-menu-container">
                      <OverlayTrigger trigger="click" placement="bottom" overlay={popoverMenu}
                                      container={this} containerPadding={5} rootClose>
                        <i className="fa fa-bars" aria-hidden="true"></i>
                      </OverlayTrigger>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <PropertyStats listing={listing} followers={followers || 0} />
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
