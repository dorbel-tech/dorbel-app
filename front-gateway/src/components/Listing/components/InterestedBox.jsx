import React, { Component } from 'react';
import ListingOwnerDetails from './ListingOwnerDetails';
import LikeButton from '~/components/LikeButton/LikeButton';

class InterestedBox extends Component {
  renderLikeCounter() {
    const totalLikes = this.props.listing.totalLikes; // returned from server for publishing users and admins only
    if (totalLikes) {
      return (
        <div className="text-center">
          {`${totalLikes} דיירים מתעניינים`}
        </div>
      );
    }
  }

  render() {
    const { listing } = this.props;
    const allowInterest = listing.status === 'listed' || listing.status === 'pending';

    return (
      <div className="listing-interested-box-content">
        <div className="listing-interested-box-content-text">
          <h4 className="listing-interested-box-content-text-heading">אהבתם? בואו נתקדם.</h4>
          <span className="listing-interested-box-content-text-explain">שלחו באופן מיידי את הפרטים שחשובים לבעלי הדירה כדי להתקדם אתכם בתהליך.</span>
        </div>
        <div className="listing-interested-box-button-container">
          {allowInterest && <LikeButton apartmentId={listing.apartment_id} listingId={listing.id} />}
          {this.renderLikeCounter()}
        </div>
        <ListingOwnerDetails listing={listing} />
      </div>
    );
  }
}

InterestedBox.propTypes = {
  listing: React.PropTypes.object.isRequired,
};

export default InterestedBox;
