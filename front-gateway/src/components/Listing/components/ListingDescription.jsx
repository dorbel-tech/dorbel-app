import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Row } from 'react-bootstrap';
import ListingAmenities from './ListingAmenities.jsx';

@inject('appProviders') @observer
class ListingDescription extends React.Component {
  renderDescriptionRow(titleText, innerContent) {
    return  <Row className="listing-description-item">
              <Col md={2}>
                <h5>{titleText}</h5>
              </Col>
              <Col md={6}>
                {innerContent}
              </Col>
            </Row>;
  }

  renderLeaseStart(listing) {
    if (listing.status === 'listed') {
      return this.renderDescriptionRow('תאריך כניסה', <p>{this.props.appProviders.utils.formatDate(listing.lease_start)}</p>);
    } else {
      return this.renderDescriptionRow('תאריך כניסה צפוי', <p>{this.props.appProviders.utils.formatDate(listing.lease_end)}</p>);
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
        {this.renderDescriptionRow(listing.publishing_user_type === 'landlord' ? 'בעל הנכס' : 'דייר יוצא', <p>{listing.publishing_user_first_name || 'אנונימי'}</p>)}
      </Row>
    );
  }
}

ListingDescription.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired
};

export default ListingDescription;
