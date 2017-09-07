import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import autobind from 'react-autobind';
import { Col, Grid, Row } from 'react-bootstrap';
import ListingDescription from './components/ListingDescription';
import ListingHighlight from './components/ListingHighlight';
import ListingHeader from './components/ListingHeader';
import ListingInfo from './components/ListingInfo';
import ListingSocial from './components/ListingSocial';
import ApartmentLocation from '~/components/MapWrapper/MapWrapper';
import RelatedListings from '~/components/RelatedListings/RelatedListings';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import ListingActions from './components/ListingActions';
import InterestedBox from './components/InterestedBox';

import utils from '~/providers/utils';

import './Listing.scss';

const shareModalQueryString = '?showShareModal';

@inject('appStore', 'appProviders') @observer
class Listing extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = { isLoading: false };
  }

  static serverPreRender(props) {
    return props.appProviders.listingsProvider.loadListingByApartmentId(props.apartmentId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.apartmentId != nextProps.apartmentId) {
      this.props = nextProps;
      this.loadFullListingDetails();
    }
  }

  componentWillMount() {
    this.loadFullListingDetails();
  }

  componentDidMount() {
    this.shouldShowShareModal();
  }

  shouldShowShareModal() {
    if (location.search.includes(shareModalQueryString)) {
      const currentUrlClean = location.href.split('?')[0];
      history.replaceState(undefined, document.title, currentUrlClean);

      this.props.appProviders.modalProvider.showShareModal({
        shareUrl: currentUrlClean,
        title: 'יאיי! דירתכם עלתה לאוויר',
        content: (
          <p>
            מה עכשיו?
            <b> שתפו את המודעה</b>
            <br />
            ברשתות החברתיות והגיעו למקסימום דיירים במינימום זמן
          </p>
        )
      });
    }
  }

  loadFullListingDetails() {
    const { apartmentId, appStore, appProviders } = this.props;
    let listing = appStore.listingStore.getByApartmentId(apartmentId);

    if (!listing) {
      this.setState({ isLoading: true });
      appProviders.listingsProvider.loadListingByApartmentId(apartmentId)
        .then(() => {
          listing = appStore.listingStore.getByApartmentId(apartmentId);
          this.reportListingPageView(listing.id);
          this.setState({ isLoading: false });
        });
    } else {
      // Force render and scroll to top, since the store did not change.
      this.forceUpdate();
      if (process.env.IS_CLIENT) {
        this.reportListingPageView(listing.id);

        const wrapperElement = document.getElementsByClassName('listing-wrapper')[0];
        if (wrapperElement) {
          wrapperElement.scrollIntoView();
        }
      }
    }
  }

  // Report fake legacy url page view by listingId to Google Analytics for our page views counter to work correctly.
  reportListingPageView(listingId) {
    window.analytics.page({
      path: '/apartments/' + listingId,
      referrer: window.document.referrer,
      search: window.location.search,
      title: window.document.title,
      url: window.location.href
    });
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
    const { apartmentId, appStore } = this.props;
    const listing = appStore.listingStore.getByApartmentId(apartmentId);

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
            שתפו חברים שמחפשים:<ListingSocial listing={listing} />
          </Col>
        </Row>
        <ListingInfo listing={listing} />
        <Row>
          <Col md={4} xs={12} className="listing-interested-box">
            <Col smHidden xsHidden>
              <ListingHighlight listing={listing} />
            </Col>
            <InterestedBox listing={listing} />
          </Col>
        </Row>
        <ListingDescription listing={listing} />
      </Grid>
      {this.renderListingLocation(listing.apartment.building.geolocation)}
      <RelatedListings apartmentId={listing.apartment_id} />
    </div>;
  }
}

Listing.wrappedComponent.propTypes = {
  apartmentId: React.PropTypes.string.isRequired,
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
  action: React.PropTypes.string
};

export default Listing;
