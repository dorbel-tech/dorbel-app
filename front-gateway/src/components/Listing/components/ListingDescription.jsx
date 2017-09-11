import React from 'react';
import autobind from 'react-autobind';
import { inject, observer } from 'mobx-react';
import { Col, Row } from 'react-bootstrap';
import { formatDate } from '~/providers/utils';
import ListingAmenities from './ListingAmenities.jsx';

@inject('appProviders', 'appStore') @observer
class ListingDescription extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  renderDescriptionRow(titleText, innerContent) {
    return <Row className="listing-description-item">
      <Col md={2}>
        <h5>{titleText}</h5>
      </Col>
      <Col md={6}>
        {innerContent}
      </Col>
    </Row>;
  }

  renderLeaseStart(listing) {
    if (listing.status === 'pending' || listing.status === 'listed') {
      return this.renderDescriptionRow('תאריך כניסה', <p>{formatDate(listing.lease_start)}</p>);
    } else {
      return this.renderDescriptionRow('תאריך כניסה צפוי', <p>{formatDate(listing.lease_end)}</p>);
    }
  }

  render() {
    const { listing } = this.props;
    const listingTax = <p> ארנונה: {listing.property_tax ? <span>{listing.property_tax}</span> : '--'}</p>;
    const listingFee = <p>ועד בית: {listing.board_fee ? <span>{listing.board_fee}</span> : '--'}</p>;
    const listingPrices = <div><p>שכר דירה: <span>{listing.monthly_rent}</span></p>{listingTax}{listingFee}</div>;

    return (
      <Row className="listing-description-container">
        {this.renderLeaseStart(listing)}
        {this.renderDescriptionRow('תאור הנכס', <p>{listing.description || '(אין תאור)'}</p>)}
        <Row className="listing-description-item">
          <Col md={2}>
            <h5>פרטי הנכס</h5>
          </Col>
          <ListingAmenities listing={listing} />
        </Row>
        {this.renderDescriptionRow('מחירים', listingPrices)}
      </Row>
    );
  }
}

ListingDescription.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired
};

export default ListingDescription;
