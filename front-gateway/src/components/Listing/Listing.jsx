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
import LikeButton from '~/components/LikeButton/LikeButton';
import ListingPageViews from './components/ListingPageViews';
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

  renderLikeCounter(totalLikes) {
    if (totalLikes && this.props.appStore.authStore.isLoggedIn) {
      return (
        <div className="like-button-total-likes-text">
          <span>
            {`${totalLikes} אוהבים את הדירה`}
          </span>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    const { appStore, action } = this.props;
    const listing = appStore.listingStore.get(this.props.listingId);
    const isListingPublisherOrAdmin = listing ? appStore.listingStore.isListingPublisherOrAdmin(listing) : false;

    if (this.state.isLoading) {
      return (
        <div className="loader-container">
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
        tabContent =
          <div>
            <Grid className="listing-container">
              <Row className="listing-title-section">
                <Col sm={5} smPush={7} md={4} mdPush={4} className="listing-actions">
                  <div className="like-button-wrapper text-center">
                    <LikeButton listingId={listing.id} showText="true" />
                    {this.renderLikeCounter(listing.totalLikes)}
                  </div>        
                  { appStore.listingStore.isListingPublisherOrAdmin(listing) ? <ListingPageViews listing={listing} /> : null }                  
                </Col>
                <Col sm={7} smPull={5} md={4} mdPull={4} className="listing-title-container">
                  <h2 className="listing-title">{utils.getListingTitle(listing)}</h2>
                  <h4 className="listing-sub-title">{utils.getListingSubTitle(listing)}</h4>
                  <ListingSocial listing={listing} />
                </Col>
              </Row>
              <ListingInfo listing={listing} />
              <Row>
                <Col md={4} xs={12} className="listing-ohe-box">
                  <Col smHidden xsHidden>
                    <ListingHighlight listing={listing} />
                  </Col>
                  <OHEList listing={listing} oheId={this.props.oheId} action={this.props.action} />
                </Col>
              </Row>
              <ListingDescription listing={listing} />
            </Grid>
            {this.renderListingLocation(listing.apartment.building.geolocation)}
            <RelatedListings listingId={listing.id} />
          </div>;
    }

    return  <div>
              <ListingHeader listing={listing} />
              <Col lgHidden mdHidden>
                <ListingHighlight listing={listing} />
              </Col>
              {isListingPublisherOrAdmin ?
                <Grid className="listing-owner-section">
                  <ListingStatusSelector listing={listing} />
                  <ListingMenu listing={listing} currentAction={action} />
                </Grid>
              : null}
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
