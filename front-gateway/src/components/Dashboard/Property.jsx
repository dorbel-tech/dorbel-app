import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Button, Col, Grid, Row, OverlayTrigger, Popover } from 'react-bootstrap';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import CloudinaryImage from '../CloudinaryImage/CloudinaryImage';
import ListingStatusSelector from './MyProperties/ListingStatusSelector';
import OHEManager from '~/components/OHEManager/OHEManager';
import PropertyMenu from './MyProperties/PropertyMenu';
import PropertyStats from './MyProperties/PropertyStats';
import { find } from 'lodash';
import utils from '~/providers/utils';

import './Property.scss';

@inject('appStore', 'appProviders', 'router') @observer
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
      this.loadFullPropertyDetails();
    }
  }

  componentWillMount() {
    this.loadFullPropertyDetails();
  }

  loadFullPropertyDetails() {
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

  refresh() {
    location.reload(true);
  }

  render() {
    const { appStore } = this.props;
    const property = appStore.listingStore.get(this.props.propertyId);
    const sortedPropertyImages = utils.sortListingImages(property);
    const imageURL = sortedPropertyImages.length ? sortedPropertyImages[0].url : '';
    const followers = appStore.oheStore.countFollowersByListingId.get(this.props.propertyId);

    const propertyTabs = [
      { relativeRoute: 'stats', title: 'סטטיסטיקות', component: <PropertyStats listing={property} followers={followers || 0} /> },
      { relativeRoute: 'ohe', title: 'מועדי ביקור', component: <OHEManager listing={property} /> },
    ];
    // TODO: Add "default" tab logic.
    const selectedTab = find(propertyTabs, {relativeRoute: this.props.tab}) || propertyTabs[0];

    const popoverMenu = (
      <Popover id="property-actions-menu" className="property-actions-menu">
        <div name={'/apartments/' + this.props.propertyId} className="property-actions-menu-item property-action-menu-item-show-mobile" onClick={this.routeClickHandler}>
          <i className="property-actions-menu-item-icon fa fa-picture-o"></i>
          צפה
        </div>
        <div className="property-actions-menu-item property-action-menu-item-show-mobile" onClick={this.refresh}>
          <i className="property-actions-menu-item-icon fa fa-refresh" aria-hidden="true"></i>
          רענון
        </div>
        <div name={'/dashboard/my-properties/' + this.props.propertyId + '/edit'}
             className="property-actions-menu-item property-actions-edit-disabled"
             {/*onClick={this.routeClickHandler}*/}>
          <i className="property-actions-menu-item-icon fa fa-pencil-square-o"  aria-hidden="true"></i>
          עריכת פרטי הנכס (בקרוב)
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
                  <CloudinaryImage src={imageURL} height={125} className="property-image"/>
                  <ListingStatusSelector listing={property} />
                </Col>
                <Col md={5} sm={6} xs={7} className="property-title-container">
                  <div className="property-title">
                    {utils.getListingTitle(property)}
                  </div>
                  <div className="property-title-details">
                    <span>
                      {property.apartment.rooms}</span>
                      <span className="property-title-details-sub-text"> חדרים</span>
                    <div className="property-title-details-vr" />
                    <span>
                      {property.apartment.size}</span>
                      <span className="property-title-details-sub-text"> מ"ר</span>
                    <div className="property-title-details-vr" />
                    <span>
                      <span className="property-title-details-sub-text property-title-details-last-text">קומה</span>
                      {utils.getFloorTextValue(property)}</span>
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
                        {property.totalLikes || 0}</span><br/>
                        <span className="property-actions-sub-title">לייקים</span>
                    </div>
                  </div>
                  <div className="property-action-container">
                    <div className="property-actions-refresh-container">
                      <Button className="fa fa-refresh property-action-button" aria-hidden="true"
                         onClick={this.refresh}></Button>
                    </div>
                    <div className="property-actions-preview-container">
                      <Button className="fa fa-picture-o property-action-button"
                              name={'/apartments/' + this.props.propertyId}
                              onClick={this.routeClickHandler}></Button>
                    </div>
                    <div className="property-actions-menu-container">
                      <OverlayTrigger trigger="click" placement="bottom" overlay={popoverMenu}
                                      container={this} containerPadding={5} rootClose>
                        <Button className="property-action-button">
                          <i className="fa fa-bars" aria-hidden="true"></i>
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </div>
                </Col>
              </Row>
              <PropertyMenu path={'/dashboard/my-properties/' + property.id + '/'}
                            tabs={propertyTabs}
                            activeKey={selectedTab.relativeRoute} />
              <Row className="property-content-container">
                {selectedTab.component}
              </Row>
            </Grid>;
  }
}

Property.wrappedComponent.propTypes = {
  propertyId: React.PropTypes.string.isRequired,
  tab: React.PropTypes.string,
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
  router: React.PropTypes.object
};

export default Property;
