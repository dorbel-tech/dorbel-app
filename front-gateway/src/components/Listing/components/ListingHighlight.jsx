import React from 'react';

class ListingInfo extends React.Component {
  render() {
    const { listing } = this.props;

    return (
      <div className="listing-highlight-container">
        <span className="listing-highlight-price">{listing.monthly_rent}</span>
        <span> ₪ / לחודש</span>
      </div>
    );
  }
}

ListingInfo.propTypes = {
  listing: React.PropTypes.object.isRequired
};

export default ListingInfo;
