import React from 'react';
import { observer } from 'mobx-react';
import { Col } from 'react-bootstrap';
import LikeButton from '~/components/LikeButton/LikeButton';
import ListingPageViews from './ListingPageViews';

@observer(['appStore'])
class ListingInfo extends React.Component {

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
    }
    else {
      return null;
    }
  }

  render() {
    const { listing, appStore } = this.props;
    const listingId = this.props.listing.id;

    return (
      <Col className="listing-actions">
        <div className="like-button-wrapper text-center">
          <LikeButton listingId={listingId} showText="true" />
          {this.renderLikeCounter()}
        </div>        
        { appStore.listingStore.isListingPublisherOrAdmin(listing) ?  <ListingPageViews listing={listing} /> : null }
      </Col>
    );
  }
}

ListingInfo.propTypes = {
  appStore: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired
};

export default ListingInfo;
