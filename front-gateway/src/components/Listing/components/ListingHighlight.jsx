import React from 'react';

class ListingHighlight extends React.Component {
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

ListingHighlight.propTypes = {
  listing: React.PropTypes.object.isRequired
};

export default ListingHighlight;
