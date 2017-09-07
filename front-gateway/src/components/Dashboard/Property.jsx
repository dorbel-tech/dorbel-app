import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';

import CloudinaryImage from '../CloudinaryImage/CloudinaryImage';
import EditListing from './MyProperties/EditListing.jsx';
import ListingStatusSelector from './MyProperties/ListingStatusSelector';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import PropertyManage from './MyProperties/PropertyManage';
import PropertyStats from './MyProperties/PropertyStats';
import utils from '~/providers/utils';
import { Button, Col, Grid, Row, Tabs, Tab, Overlay, Popover } from 'react-bootstrap';
import { find } from 'lodash';
import { getPropertyPath, getDashMyPropsPath } from '~/routesHelper';

import './Property.scss';

@inject('appStore', 'appProviders', 'router') @observer
class Property extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = { isLoading: true };
  }

  static serverPreRender(props) {
    return props.appProviders.listingsProvider.loadFullListingDetails(props.listingId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.listingId != nextProps.listingId) {
      this.props = nextProps;
      this.loadFullPropertyDetails();
    }
  }

  componentDidMount() {
    this.loadFullPropertyDetails();
  }

  loadFullPropertyDetails() {
    const { listingId, appStore, appProviders } = this.props;

    const loadListing = appStore.listingStore.get(listingId) ?
      Promise.resolve() : appProviders.listingsProvider.loadFullListingDetails(listingId);

    loadListing.then(this.listingLoadedHandler);
  }

  listingLoadedHandler() {
    const { listingId, appStore } = this.props;
    const listing = appStore.listingStore.get(listingId);
    appStore.editedListingStore.loadListing(listing);

    this.setState({ isLoading: false });
  }

  gotoPublishedListing() {
    return this.props.router.setRoute(getPropertyPath(this.property));
  }

  gotoEditProperty() {
    this.hideActionsMenu();
    return this.props.router.setRoute(getDashMyPropsPath(this.property, '/edit'));
  }

  showActionsMenu() {
    this.setState({ showActionsMenu: true });
  }

  hideActionsMenu() {
    this.setState({ showActionsMenu: false });
  }

  renderActionsMenu(isActiveListing) {
    return (
      <Popover onMouseEnter={this.showActionsMenu}
               onMouseLeave={this.hideActionsMenu}
               id="property-actions-menu"
               className="property-actions-menu">
        <div className="property-actions-menu-item" onClick={this.gotoPublishedListing}>
          <i className="property-actions-menu-item-icon fa fa-picture-o"></i>
          צפייה במודעה
        </div>
        {isActiveListing &&
          <div className="property-actions-menu-item" onClick={this.gotoEditProperty}>
            <i className="property-actions-menu-item-icon fa fa-pencil-square-o" aria-hidden="true"></i>
            עריכת המודעה
          </div>
        }
      </Popover>
    );
  }

  render() {
    const { appStore, appProviders, router } = this.props;
    this.property = appStore.listingStore.get(this.props.listingId);

    if (this.state.isLoading) {
      return (
        <div className="loader-container">
          <LoadingSpinner />
        </div>
      );
    } else if (!appStore.listingStore.isListingPublisherOrAdmin(this.property)) {
      return null;
    }

    const propertyPath = getDashMyPropsPath(this.property, '/');
    const sortedPropertyImages = utils.sortListingImages(this.property);
    const imageURL = sortedPropertyImages[0].url;
    const isActiveListing = appProviders.listingsProvider.isActiveListing(this.property);
    const imageClass = 'property-image' + (isActiveListing ? '' : ' property-image-inactive');
    const titleClass = 'property-title' + (isActiveListing ? '' : ' property-title-inactive');
    let editForm = null;

    const defaultHeaderButtons = (
      <div className="property-action-container">
        <div className="property-actions-item-container">
          <Button className="property-action-button property-preview-button"
                  onClick={this.gotoPublishedListing}>
            צפייה במודעה
          </Button>
        </div>
        {isActiveListing &&
          <div className="property-actions-item-container">
            <Button className="property-action-button property-edit-button"
                    onClick={this.gotoEditProperty}>
              עריכת המודעה
            </Button>
          </div>
        }
        <div className="property-actions-menu-container">
          <Button className="property-action-button"
                  onMouseEnter={this.showActionsMenu}
                  onMouseLeave={this.hideActionsMenu}
                  onClick={this.showActionsMenu}
                  ref={(el) => { this.propertyActionMenuIcon = el; }}>
            תפריט
            <i className="fa fa-caret-down"
               aria-hidden="true"></i>
          </Button>
          <Overlay show={this.state.showActionsMenu}
                   onHide={this.hideActionsMenu}
                   placement="bottom"
                   target={this.propertyActionMenuIcon}
                   rootClose>
            {this.renderActionsMenu(isActiveListing)}
          </Overlay>
        </div>
      </div>
    );

    const disableSave = appStore.editedListingStore.shouldDisableSave;

    const editHeaderButtons = (
      <div className="property-action-container">
        <div className="property-actions-menu-container property-edit-actions-mobile">
          <Button bsStyle="success" onClick={() => editForm.wrappedInstance.save()}
                  disabled={disableSave}>
            שמור
          </Button>
          <Button onClick={() => editForm.wrappedInstance.cancel()}>
            בטל
          </Button>
        </div>
      </div>
    );

    const propertyTabs = [
      { relativeRoute: 'stats', title: 'סטטיסטיקה', component: <PropertyStats listing={this.property} /> },
      { relativeRoute: 'manage', title: 'שכירות', component: <PropertyManage listing={this.property} /> },
      { relativeRoute: 'edit', title: 'עריכת פרטי הנכס', component: <EditListing listing={this.property} ref={form => editForm = form} />,
        replaceNavbar: true, hideFromMenu: true, headerButtons: editHeaderButtons }
    ];
    // TODO: Add "default" tab logic.
    const activeTab = find(propertyTabs, {relativeRoute: this.props.tab}) || propertyTabs[0];

    return  <Grid fluid className="property-wrapper">
              <Row className="property-top-container">
                <Col md={3} sm={3} xs={4} className="property-image-container">
                  <CloudinaryImage src={imageURL} height={125} className={imageClass}/>
                </Col>
                <Col md={5} sm={6} xs={8} className="property-title-container">
                  <div className={titleClass}>
                    {utils.getListingTitle(this.property)}
                  </div>
                  <div className="property-title-details">
                    <div className="property-title-details-sub">
                      <span>{this.property.apartment.rooms}</span>
                      <span className="property-title-details-sub-text">&nbsp;חדרים</span>
                    </div>
                    <div className="property-title-details-sub">
                      <span>{this.property.apartment.size}</span>
                      <span className="property-title-details-sub-text">&nbsp;מ"ר</span>
                    </div>
                    <div className="property-title-details-sub">
                      <span>{utils.getFloorTextValue(this.property)}</span>
                      <span className="property-title-details-sub-text">&nbsp;קומה</span>
                    </div>
                  </div>
                  <div className="property-status-desktop property-title-details-sub-text">
                    סטטוס:
                    <ListingStatusSelector listing={this.property} />
                  </div>
                </Col>
                <Col md={4} sm={3} className="property-actions-wrapper">
                  { activeTab.headerButtons || defaultHeaderButtons }
                </Col>
              </Row>
              <Row className="property-top-container property-status-mobile">
                <Col sm={3} xs={4} className="property-status-label">
                  סטטוס המודעה:
                </Col>
                <Col sm={9} xs={8} className="property-status-selector-container">
                  <ListingStatusSelector listing={this.property} />
                </Col>
              </Row>
              { activeTab.replaceNavbar ? activeTab.component :
                  <Row className="property-content-container">
                    {activeTab.component}
                  </Row>
              }
            </Grid>;
  }
}

Property.wrappedComponent.propTypes = {
  listingId: React.PropTypes.string.isRequired,
  tab: React.PropTypes.string,
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
  router: React.PropTypes.object
};

export default Property;
