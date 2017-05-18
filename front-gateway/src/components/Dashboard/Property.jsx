import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Button, Col, Grid, Row, Tabs, Tab, Overlay, Popover } from 'react-bootstrap';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import CloudinaryImage from '../CloudinaryImage/CloudinaryImage';
import ListingStatusSelector from './MyProperties/ListingStatusSelector';
import OHEManager from '~/components/OHEManager/OHEManager';
import PropertyManage from './MyProperties/PropertyManage';
import PropertyStats from './MyProperties/PropertyStats';
import EditListing from './MyProperties/EditListing.jsx';
import { find } from 'lodash';
import utils from '~/providers/utils';
import { getListingPath, getDashMyPropsPath } from '~/routesHelper';

import './Property.scss';

@inject('appStore', 'appProviders', 'router') @observer
class Property extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = { isLoading: true };
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

  componentDidMount() {
    this.loadFullPropertyDetails();
  }

  loadFullPropertyDetails() {
    const { propertyId, appStore, appProviders } = this.props;

    const loadListing = appStore.listingStore.get(propertyId) ?
      Promise.resolve() : appProviders.listingsProvider.loadFullListingDetails(propertyId);
    loadListing.then(() => {
      const listing = appStore.listingStore.get(propertyId);
      appProviders.oheProvider.loadListingEvents(propertyId);
      appProviders.oheProvider.getFollowsForListing(propertyId, listing.publishing_user_id);
      this.setState({ isLoading: false })
    });
  }

  gotoPublishedListing(property) {
    return this.props.router.setRoute(getListingPath(property));
  }

  gotoEditProperty(property){
    this.hideActionsMenu();
    return this.props.router.setRoute(getDashMyPropsPath(property, '/edit'));
  }

  refresh() {
    location.reload(true);
  }

  showActionsMenu() {
    this.setState({ showActionsMenu: true });
  }

  hideActionsMenu() {
    this.setState({ showActionsMenu: false });
  }

  renderActionsMenu(property) {
    return (
      <Popover onMouseEnter={this.showActionsMenu}
               onMouseLeave={this.hideActionsMenu}
               id="property-actions-menu"
               className="property-actions-menu">
        <div className="property-actions-menu-item property-action-menu-item-show-mobile" onClick={() => this.gotoPublishedListing(property)}>
          <i className="property-actions-menu-item-icon fa fa-picture-o"></i>
          לצפייה במודעה
        </div>
        <div className="property-actions-menu-item property-action-menu-item-show-mobile" onClick={this.refresh}>
          <i className="property-actions-menu-item-icon fa fa-refresh" aria-hidden="true"></i>
          רענון נתונים
        </div>
        <div className="property-actions-menu-item" onClick={() =>this.gotoEditProperty(property)}>
          <i className="property-actions-menu-item-icon fa fa-pencil-square-o"  aria-hidden="true"></i>
          עריכת פרטי הנכס
        </div>
      </Popover>
    );
  }

  render() {
    const { appStore, router } = this.props;
    const property = appStore.listingStore.get(this.props.propertyId);

    if (this.state.isLoading) {
      return (
        <div className="loader-container">
          <LoadingSpinner />
        </div>
      );
    } else if (!appStore.listingStore.isListingPublisherOrAdmin(property)) {
      return null;
    }

    const propertyPath = getDashMyPropsPath(property, '/');
    const sortedPropertyImages = utils.sortListingImages(property);
    const imageURL = sortedPropertyImages.length ? sortedPropertyImages[0].url : '';
    const followers = appStore.oheStore.countFollowersByListingId.get(this.props.propertyId);
    let editForm = null;

    const defaultHeaderButtons = (
      <div className="property-action-container">
        <div className="property-actions-refresh-container">
          <Button className="fa fa-refresh property-action-button" title="רענון העמוד"
              onClick={this.refresh}></Button>
        </div>
        <div className="property-actions-preview-container">
          <Button className="fa fa-picture-o property-action-button" title="צפייה במודעה"
                  onClick={() => this.gotoPublishedListing(property)}></Button>
        </div>
        <div className="property-actions-menu-container">
          <Button className="property-action-button"
                  onMouseEnter={this.showActionsMenu}
                  onMouseLeave={this.hideActionsMenu}
                  onClick={this.showActionsMenu}>
            <i ref={(el) => { this.propertyActionMenuIcon = el; }}
               className="fa fa-bars"
               aria-hidden="true"></i>
          </Button>
          <Overlay show={this.state.showActionsMenu}
                   onHide={this.hideActionsMenu}
                   placement="bottom"
                   target={this.propertyActionMenuIcon}
                   rootClose>
            {this.renderActionsMenu(property)}
          </Overlay>
        </div>
      </div>
    );

    const editHeaderButtons = (
      <div className="property-action-container">
        <div className="property-actions-menu-container property-edit-actions-mobile">
          <Button bsStyle="success" onClick={() => editForm.wrappedInstance.save()}
                  disabled={appStore.editedListingStore.disableSave}>
            שמור
          </Button>
          <Button onClick={() => editForm.wrappedInstance.cancel()}>
            בטל
          </Button>
        </div>
      </div>
    );

    const propertyTabs = [
      { relativeRoute: 'stats', title: 'סטטיסטיקה', component: <PropertyStats listing={property} followers={followers || 0} /> },
      { relativeRoute: 'ohe', title: 'מועדי ביקור', component: <OHEManager listing={property} /> },
      { relativeRoute: 'manage', title: 'ניהול', component: <PropertyManage listing={property} /> },
      { relativeRoute: 'edit', title: 'עריכת פרטי הנכס', component: <EditListing listing={property} ref={form => editForm = form} />,
        replaceNavbar: true, hideFromMenu: true, headerButtons: editHeaderButtons }
    ];
    // TODO: Add "default" tab logic.
    const activeTab = find(propertyTabs, {relativeRoute: this.props.tab}) || propertyTabs[0];

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
                      <span className="property-title-details-sub-text">&nbsp;חדרים</span>
                    <div className="property-title-details-vr" />
                    <span>
                      {property.apartment.size}</span>
                      <span className="property-title-details-sub-text">&nbsp;מ"ר</span>
                    <div className="property-title-details-vr" />
                    <span>
                      {utils.getFloorTextValue(property)}</span>
                      <span className="property-title-details-sub-text">&nbsp;קומה</span>
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
                  { activeTab.headerButtons || defaultHeaderButtons }
                </Col>
              </Row>
              { !activeTab.replaceNavbar &&
                  <Tabs className="tab-menu" activeKey={activeTab}
                        onSelect={(tab) => router.setRoute(propertyPath + tab.relativeRoute)} id="property-menu-tabs">
                    {propertyTabs.filter(tab => !tab.hideFromMenu).map(tab =>
                      <Tab eventKey={tab} key={tab.relativeRoute} title={tab.title}></Tab>
                    )}
                  </Tabs>
              }
              { activeTab.replaceNavbar ? activeTab.component :
                  <Row className="property-content-container">
                    {activeTab.component}
                  </Row>
              }
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
