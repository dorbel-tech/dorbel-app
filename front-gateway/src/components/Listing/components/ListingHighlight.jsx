import React from 'react';

class ListingInfo extends React.Component {
  render() {
    const { listing } = this.props;

    return (
      <div className="listing-price-container">
        <div className="listing-price">{listing.monthly_rent}</div>
        <div className="listing-price-desc"> ₪ / לחודש</div>
      </div>
    );
  }
}

ListingInfo.propTypes = {
  listing: React.PropTypes.object.isRequired
};

export default ListingInfo;
