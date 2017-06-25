import React from 'react';
import autobind from 'react-autobind';
import { inject, observer } from 'mobx-react';
import { Col, Row, Button } from 'react-bootstrap';
import ListingAmenities from './ListingAmenities.jsx';

@inject('appProviders', 'appStore') @observer
class ListingDescription extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      showPhoneClicked: false
    };
  }

  componentWillUnmount() {
    const { utils } = this.props.appProviders;

    this.popup && this.popup.destroy();
    utils.hideIntercom(false);
  }

  renderDescriptionRow(titleText, innerContent) {
    return <Row className="listing-description-item">
      <Col md={2}>
        <h5>{titleText}</h5>
      </Col>
      <Col md={6}>
        {innerContent}
      </Col>
    </Row>;
  }

  renderLeaseStart(listing) {
    const utils = this.props.appProviders.utils;
    if (listing.status === 'listed') {
      return this.renderDescriptionRow('תאריך כניסה', <p>{utils.formatDate(listing.lease_start)}</p>);
    } else {
      return this.renderDescriptionRow('תאריך כניסה צפוי', <p>{utils.formatDate(listing.lease_end)}</p>);
    }
  }

  renderPhone(listing) {
    if (listing.show_phone) {
      if (this.state.showPhoneClicked) {
        return (
          <a href={`tel:${listing.publishing_user_phone}`}>
            <span>
              {listing.publishing_user_phone}
            </span>
          </a>
        );
      }
      else {
        return (
          <Button onClick={this.handleShowPhoneClick}>
            <i className="fa fa-phone" />
            &nbsp;הצג טלפון
          </Button>
        );
      }
    }
  }

  renderMsg() {
    return <Button onClick={this.handleMsgClick}>
             <i className="fa fa-comment" />
             &nbsp;שלח הודעה
           </Button>;
  }

  handleShowPhoneClick() {
    if (this.props.appStore.authStore.isLoggedIn) {
      const { listing } = this.props;
      this.setState({ showPhoneClicked: true });
      window.analytics.track('client_show_phone', { listing_id: listing.id, user_id: listing.publishing_user_id }); // For Facebook conversion tracking.
    }
    else {
      this.props.appProviders.authProvider.showLoginModal();
    }
  }

  handleMsgClick() {
    if (this.props.appStore.authStore.isLoggedIn) {
      const listing = this.props.listing;
      const { messagingProvider, utils } = this.props.appProviders;

      global.window.Talk.ready.then(() => {
        const withUserObj = {
          id: listing.publishing_user_id,
          name: listing.publishing_user_first_name,
          email: listing.publishing_user_email,
          configuration: 'general',
          welcomeMessage: 'באפשרותך לשלוח הודעה לבעל הדירה. במידה והוא אינו מחובר הודעתך תישלך אליו למייל.'
        };
        const conversation = messagingProvider.getOrStartConversation(withUserObj, {
          topicId: listing.listing_id,
          subject: utils.getListingTitle(listing)
        });

        this.popup = messagingProvider.talkSession.createPopup(conversation);
        this.popup.mount();

        utils.hideIntercom(true);
      });
    } else {
      this.props.appProviders.authProvider.showLoginModal();
    }
  }

  render() {
    const { listing } = this.props;
    const listingTax = <p> ארנונה: {listing.property_tax ? <span>{listing.property_tax}</span> : '--'}</p>;
    const listingFee = <p>ועד בית: {listing.board_fee ? <span>{listing.board_fee}</span> : '--'}</p>;
    const listingPrices = <div><p>שכר דירה: <span>{listing.monthly_rent}</span></p>{listingTax}{listingFee}</div>;

    return (
      <Row className="listing-description-container">
        {this.renderLeaseStart(listing)}
        {this.renderDescriptionRow('תאור הנכס', <p>{listing.description || '(אין תאור)'}</p>)}
        <Row className="listing-description-item">
          <Col md={2}>
            <h5>פרטי הנכס</h5>
          </Col>
          <ListingAmenities listing={listing} />
        </Row>
        {this.renderDescriptionRow('מחירים', listingPrices)}
        {
          this.renderDescriptionRow(
            listing.publishing_user_type === 'landlord' ? 'בעל הנכס' : 'דייר יוצא',
            <div>
              <p>{listing.publishing_user_first_name || 'אנונימי'}</p>
              {this.renderPhone(listing)}
              {this.renderMsg()}
            </div>
          )
        }
      </Row>
    );
  }
}

ListingDescription.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired
};

export default ListingDescription;
