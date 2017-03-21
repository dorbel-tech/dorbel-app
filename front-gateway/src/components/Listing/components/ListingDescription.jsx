import React from 'react';
import { observer } from 'mobx-react';
import { Col, Row } from 'react-bootstrap';
import ListingAmenities from './ListingAmenities.jsx';

@observer(['appProviders'])
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

  render() {
    const { listing } = this.props;
    const listingTax = listing.property_tax ? <p>ארנונה: <span>{listing.property_tax}</span></p> : null;
    const listingFee = listing.board_fee ? <p>ועד בית: <span>{listing.board_fee}</span></p> : null;
    const listingPrices = <div><p>שכר דירה: <span>{listing.monthly_rent}</span></p>{listingTax}{listingFee}</div>;

    return (
      <Row className="listing-description-container">
        {this.renderDescriptionRow('תאריך כניסה', <p>{this.props.appProviders.utils.formatDate(listing.lease_start)}</p>)}
        {listing.description ? this.renderDescriptionRow('תאור הנכס', <p>{listing.description}</p>) : null}
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
