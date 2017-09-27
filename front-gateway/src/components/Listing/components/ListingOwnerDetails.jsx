import React, { Component } from 'react';

class ListingOwnerDetails extends Component {
  render() {
    const { listing } = this.props;
    const title = listing.publishing_user_type === 'landlord' ? 'בעל הדירה' : 'דייר יוצא';

    return (
      <div className="listing-owner-container">
        <span>{title}: </span>
        <span>{listing.publishing_user_first_name || 'אנונימי'}</span>
        <div className="listing-owner-container-text-explain">הודיעו לבעל הדירה שאתם מעוניינים בדירה שיוכל לחזור אליכם</div>
      </div>
    );
  }
}

ListingOwnerDetails.propTypes = {
  listing: React.PropTypes.object.isRequired
};

export default ListingOwnerDetails;
