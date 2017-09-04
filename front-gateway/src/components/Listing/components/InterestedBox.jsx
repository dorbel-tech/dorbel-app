import React, { Component } from 'react';
import ListingOwnerDetails from './ListingOwnerDetails';
import LikeButton from '~/components/LikeButton/LikeButton';

class InterestedBox extends Component {
  render() {
    const { listing } = this.props;

    return (
      <div className="listing-interested-box-content">
        <div className="listing-interested-box-content-text">
          <h4 className="listing-interested-box-content-text-heading">מעוניינים בדירה?</h4>
          <span className="listing-interested-box-content-text-explain">הודיעו לבעל הדירה שאתם מעוניינים בדירה שיוכל לחזור אליכם</span>
        </div>
        <ListingOwnerDetails listing={listing} />
        <div className="listing-interested-box-button-container">
          <LikeButton apartmentId={listing.apartment_id} listingId={listing.id} showText />
        </div>
      </div>
    );
  }
}

InterestedBox.propTypes = {
  listing: React.PropTypes.object.isRequired,
};

export default InterestedBox; 
