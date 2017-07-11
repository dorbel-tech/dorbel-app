import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'react-bootstrap';
import autobind from 'react-autobind';

@inject('appStore', 'appProviders') @observer
class ListingOwnerDetails extends Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = { showPhoneClicked: false };
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
    if (!process.env.TALKJS_PUBLISHABLE_KEY) {
      return;
    }

    const { profile } = this.props.appStore.authStore;
    const { listing } = this.props;

    if (profile && (profile.dorbel_user_id === listing.publishing_user_id)) {
      return;
    }

    return (
      <div className="float-left">
        <Button onClick={this.handleMsgClick} title="שלחו הודעה לבעל הדירה">
          <i className="fa fa-comment" />
          &nbsp;שלח הודעה
        </Button>
      </div>
    );
  }

  handleShowPhoneClick() {
    if (!this.props.appProviders.authProvider.shouldLogin()) {
      const { listing } = this.props;
      this.setState({ showPhoneClicked: true });
      window.analytics.track('client_show_phone', { listing_id: listing.id, user_id: listing.publishing_user_id }); // For Facebook conversion tracking.
    }
  }

  handleMsgClick() {
    if (!this.props.appProviders.authProvider.shouldLogin()) {
      const listing = this.props.listing;
      const { messagingProvider, utils } = this.props.appProviders;

      const withUserObj = {
        id: listing.publishing_user_id,
        name: listing.publishing_user_first_name,
        email: listing.publishing_user_email,
        welcomeMessage: 'באפשרותך לשלוח הודעה לבעל הדירה. במידה והוא אינו מחובר הודעתך תישלח אליו למייל.'
      };
      messagingProvider.getOrStartConversation(withUserObj, {
        topicId: listing.listing_id,
        subject: utils.getListingTitle(listing)
      }).then(popup => this.popup = popup);
    }
  }

  render() {
    const { listing } = this.props;
    const title = listing.publishing_user_type === 'landlord' ? 'בעל הנכס' : 'דייר יוצא';

    return (
      <div className="listing-owner-container">
        <div className="float-right">
          <span className="listing-owner-title">{title}: </span>
          <span>{listing.publishing_user_first_name || 'אנונימי'}</span>
        </div>
        {this.renderMsg()}
      </div>
    );
  }
}

ListingOwnerDetails.wrappedComponent.propTypes = {
  listing: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
};

export default ListingOwnerDetails;
