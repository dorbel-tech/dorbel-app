import React from 'react';
import { Row } from 'react-bootstrap';

class ListingInfo extends React.Component {
  render() {
    const { listing } = this.props;

    return (
      <Row className="listing-price-container">
        <div className="listing-price">{listing.monthly_rent}</div>
        <div className="listing-price-desc"> ₪ / לחודש</div>
      </Row>
    );
  }
}

ListingInfo.propTypes = {
  listing: React.PropTypes.object.isRequired
};

export default ListingInfo;
