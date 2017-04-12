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
    const listingId = this.props.listing.id;
    const { listing, appStore } = this.props;

    return (
      <Col sm={5} smPush={7} md={4} mdPush={4} className="listing-actions">
        <div className="like-button-wrapper text-center">
          <LikeButton listingId={listingId} showText="true" />
          {this.renderLikeCounter()}
        </div>        
        { appStore.listingStore.isListingPublisherOrAdmin(listing) ? <ListingPageViews listing={listing} /> : null }                  
      </Col>
    );
  }
}

ListingActions.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired
};

export default ListingActions;
