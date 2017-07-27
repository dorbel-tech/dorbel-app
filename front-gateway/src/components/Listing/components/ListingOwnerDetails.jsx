import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'react-bootstrap';
import autobind from 'react-autobind';

@inject('appStore', 'appProviders') @observer
class ListingOwnerDetails extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      showPhoneClicked: false
    };
  }

  renderPhone(listing) {
    const { listing } = this.props;

    if (listing.show_phone && this.isListedOrRented()) {
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
          <Button className="listing-owner-show-phone" onClick={this.handleShowPhoneClick} title="הציגו טלפון של מפרסם המודעה">
            <i className="fa fa-phone" />
            &nbsp;הצג טלפון
          </Button>
        );
      }
    }
  }

  handleShowPhoneClick() {
    if (!this.props.appProviders.authProvider.shouldLogin()) {
      const { listing } = this.props;
      this.setState({ showPhoneClicked: true });
      window.analytics.track('client_show_phone', { listing_id: listing.id, user_id: listing.publishing_user_id }); // For Facebook conversion tracking.
    }
  }

  renderMsg(listing) {
    const { listing } = this.props;

    // Allow to contact only in following listing statuses.
    if (process.env.TALKJS_PUBLISHABLE_KEY && this.isListedOrRented()) {
      const { profile } = this.props.appStore.authStore;

      // Don't show for listing owner.
      if (profile && (profile.dorbel_user_id === listing.publishing_user_id)) {
        return;
      }

      return (
        <Button className="listing-owner-send-message" onClick={this.handleMsgClick} title="שלחו הודעה למפרס המודעה">
          <i className="fa fa-comment" />
            &nbsp;שלח הודעה
        </Button>
      );
   }
  }

  handleMsgClick() {
    if (!this.props.appProviders.authProvider.shouldLogin()) {
      const listing = this.props.listing;
      const { messagingProvider, utils } = this.props.appProviders;
      window.analytics.track('client_send_message', { listing_id: listing.id }); // For Facebook conversion tracking.

      const withUserObj = {
        id: listing.publishing_user_id,
        name: listing.publishing_user_first_name,
        email: listing.publishing_user_email,
        welcomeMessage: 'באפשרותך לשלוח הודעה למפרסם המודעה. במידה והוא אינו מחובר הודעתך תישלח אליו למייל.'
      };
      messagingProvider.getOrStartConversation(withUserObj, {
        topicId: listing.listing_id,
        subject: utils.getListingTitle(listing)
      }).then(popup => this.popup = popup);
    }
  }

  isListedOrRented() {
    const { listing } = this.props;
    return listing.status == 'listed' || listing.status == 'rented';
  }

  render() {
    const { listing } = this.props;
    const title = listing.publishing_user_type === 'landlord' ? 'בעל הנכס' : 'דייר יוצא';

    return (
      <div className="listing-owner-container">
        <div>
          <span className="listing-owner-title">{title}: </span>
          <span>{listing.publishing_user_first_name || 'אנונימי'}</span>
        </div>
        <div className="listing-owner-contact-container">
          {this.renderPhone()}
          {this.renderMsg()}
        </div>
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
