import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col } from 'react-bootstrap';
import LikeButton from '~/components/LikeButton/LikeButton';
import ListingPageViews from './ListingPageViews';

@inject('appStore') @observer
class ListingActions extends React.Component {

  renderLikeCounter() {
    const totalLikes = this.props.listing.totalLikes;
    if (totalLikes && this.props.appStore.authStore.isLoggedIn) {
      return (
        <div className="listing-actions-like-button-sub-text">
          {`${totalLikes} אוהבים את הדירה`}
        </div>
      );
    } else {
      return this.renderLikeDescription();
    }
  }

  renderLikeDescription() {
    return (
      <div className="listing-actions-like-button-sub-text">
      </div>
    );
  }

  render() {
    const { listing, appStore } = this.props;
    const isListingPublisherOrAdmin = appStore.listingStore.isListingPublisherOrAdmin(listing);

    return (
      <Col sm={5} smPush={7} md={4} mdPush={4} className="listing-actions">
        <div className="listing-actions-like-button-wrapper">
          <LikeButton apartmentId={listing.apartment_id} listingId={listing.id} showText />
          { isListingPublisherOrAdmin ? this.renderLikeCounter() : this.renderLikeDescription() }
        </div>
        { isListingPublisherOrAdmin ? <ListingPageViews listing={listing} /> : null }
      </Col>
    );
  }
}

ListingActions.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired
};

export default ListingActions;
