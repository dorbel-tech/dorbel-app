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
import Icon from '~/components/Icon/Icon';
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

  render() {
    const { appStore, action } = this.props;
    const listing = appStore.listingStore.get(this.props.listingId);
    const isListingPublisherOrAdmin = listing ? appStore.listingStore.isListingPublisherOrAdmin(listing) : false;
    const website_url = process.env.FRONT_GATEWAY_URL || 'https://app.dorbel.com';
    const currentUrl = website_url + '/apartments/' + listing.id;

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
                <Col sm={5} smPush={7} md={4} mdPush={4}>
                  <ListingSocial listing={listing} />
                </Col>
                <Col sm={7} smPull={5} md={4} mdPull={4} className="listing-title-container">
                  <h2 className="listing-title">{utils.getListingTitle(listing)}</h2>
                  <h4 className="listing-sub-title">{utils.getListingSubTitle(listing)}</h4>
                  <div className="listing-social-share-wrapper">
                    שתפו
                    <div className="listing-social-share-container">
                      <a className="listing-social-share-item fa fa-facebook-f fb-desktop" href={'https://www.facebook.com/sharer.php?u=' + currentUrl + '?utm_source=apt_page_facebook_share'} target="_blank"></a>
                      <a className="listing-social-share-item fa fa-facebook-f fb-mobile" href={'fb://publish/profile/#me?text=' + currentUrl + '?utm_source=apt_page_facebook_share'}></a>
                      <a className="listing-social-share-item email fa fa-envelope-o" href={'mailto:?subject=Great%20apartment%20from%20dorbel&amp;body=' + currentUrl + '?utm_source=apt_page_email_share'}></a>
                      <a className="listing-social-share-item whatsapp fa fa-whatsapp" href={'whatsapp://send?text=היי, ראיתי דירה באתר dorbel שאולי תעניין אותך. ' + currentUrl + '?utm_source=apt_page_whatsapp_share'} data-href={currentUrl + '?utm_source=apt_page_whatsapp_share'} data-text="היי, ראיתי דירה באתר dorbel שאולי תעניין אותך."></a>
                      <a className="listing-social-share-item fb-messenger-desktop" href={'https://www.facebook.com/dialog/send?app_id=1651579398444396&link=' + currentUrl + '?utm_source=apt_page_messenger_share' + '&redirect_uri=' + currentUrl + '?utm_source=apt_page_messenger_share'} target="_blank"><Icon iconName="dorbel-icon-social-fbmsg" /></a>
                      <a className="listing-social-share-item fb-messenger-mobile" href={'fb-messenger://share/?link=' + currentUrl + '?utm_source=apt_page_messenger_share' + '&app_id=1651579398444396'}><Icon iconName="dorbel-icon-social-fbmsg" /></a>
                    </div>
                  </div>
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
