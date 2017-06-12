import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Col, Grid, Row, Button } from 'react-bootstrap';
import OHEList from './components/OHEList';
import ListingDescription from './components/ListingDescription';
import ListingHighlight from './components/ListingHighlight';
import ListingHeader from './components/ListingHeader';
import ListingInfo from './components/ListingInfo';
import ListingSocial from './components/ListingSocial';
import ApartmentLocation from '~/components/MapWrapper/MapWrapper';
import RelatedListings from '~/components/RelatedListings/RelatedListings';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import ListingActions from './components/ListingActions';
import utils from '~/providers/utils';
import ismobilejs from 'ismobilejs';

import './Listing.scss';

@inject('appStore', 'appProviders') @observer
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

  componentDidMount() {
    this.shouldShowSharePopup();
  }

  shouldShowSharePopup() {
    if (location.search.includes('?showSharePopup')) {
      history.replaceState(undefined, document.title, location.href);
      const { modalProvider } = this.props.appProviders;
      const currentUrl = location.href.split('?')[0];

      modalProvider.showInfoModal({
        body:
        <div className="listing-approved-share-modal">
          <h1 className="listing-approved-share-modal-title">יאיי! דירתכם עלתה לאתר.</h1>
          <div className="listing-approved-share-modal-heading">
            מה עכשיו? <span className="bold">שתפו את המודעה!</span>
          </div>
          <div className="listing-approved-share-modal-body-text">
            שתפו את מודעת הדירה ברשתות החברתיות והגיעו למקסימום דיירים במינימום זמן
          </div>
          {ismobilejs.phone ?
            (
              <div>
                <div className="listing-approved-share-modal-button-wrapper">
                  <Button
                    href={'whatsapp://send'}
                    data-href={currentUrl + '?utm_source=apt_page_whatsapp_share'}>
                    שתפו ב
                    -&nbsp;
                <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/icons/whatsapp.svg" />
                  </Button>
                </div>
                <div className="listing-approved-share-modal-button-wrapper">
                  <Button
                    href={'fb://publish/profile/#me?text=' + currentUrl + '?utm_source=apt_page_facebook_share'}>
                    שתפו ב-
                    &nbsp;
                    <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/icons/facebook.svg" />
                  </Button>
                </div>
              </div>
            )
            :
            (
              <div className="listing-approved-share-modal-button-wrapper">
                <Button
                  href={'https://www.facebook.com/sharer.php?u=' + currentUrl + '?utm_source=apt_page_facebook_share'}
                  className="rented-congrats-modal-button" >
                  שתפו ב-
                  &nbsp;
                <img src="https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/icons/facebook.svg" />
                </Button>
              </div>
            )
          }
          <div className="listing-approved-share-modal-contact-us">
            לשאלות נוספות ויצירת קשר בנוגע לדירה שלחו לנו מייל: <a href="mailto:homesupport@dorbel.com">homesupport@dorbel.com</a>
          </div>
        </div>,
        modalSize: 'large'
      });
    }
  }

  loadFullListingDetails() {
    let listingId = this.props.listingId;

    if (!this.props.appStore.listingStore.get(listingId)) {
      this.setState({ isLoading: true });
      this.props.appProviders.listingsProvider.loadFullListingDetails(listingId)
        .then(() => this.setState({ isLoading: false }));
    } else {
      // Force render and scroll to top, since the store did not change.
      this.forceUpdate();
      if (process.env.IS_CLIENT) {
        const wrapperElement = document.getElementsByClassName('listing-wrapper')[0];
        if (wrapperElement) {
          wrapperElement.scrollIntoView();
        }
      }
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
    const { appStore } = this.props;
    const listing = appStore.listingStore.get(this.props.listingId);

    if (this.state.isLoading) {
      return (
        <div className="loader-container">
          <LoadingSpinner />
        </div>
      );
    }

    return <div className="listing-wrapper">
      <ListingHeader listing={listing} />
      <Col lgHidden mdHidden>
        <ListingHighlight listing={listing} />
      </Col>
      <Grid className="listing-container">
        <Row className="listing-title-section">
          <ListingActions listing={listing} />
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
}

Listing.wrappedComponent.propTypes = {
  listingId: React.PropTypes.string.isRequired,
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
  oheId: React.PropTypes.string,
  action: React.PropTypes.string
};

export default Listing;
