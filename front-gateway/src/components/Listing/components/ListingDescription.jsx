import React from 'react';
import { observer } from 'mobx-react';
import { Col, Grid, Row } from 'react-bootstrap';
import ListingAmenities from './ListingAmenities.jsx';

@observer(['appProviders'])
class ListingDescription extends React.Component {
  renderDescriptionRow(titleText, innerContent) {
    return <Row className="listing-description-item">
        <Col md={2}>
          <h5>{titleText}</h5>
        </Col>
        <Col md={10}>
          {innerContent}
        </Col>
      </Row>;
  }

  render() {
    const { listing } = this.props;

    return (
      <Col lg={9} className="listing-description-container">
        {this.renderDescriptionRow('תאריך כניסה', <p>{this.props.appProviders.utils.formatDate(listing.lease_start)}</p>)}
        {this.renderDescriptionRow('תאור הנכס', <p>{listing.description}</p>)}
        <ListingAmenities listing={listing} />
        {this.renderDescriptionRow('פרטי תשלום', <div><p>ארנונה: {listing.property_tax}</p><p>ועד הבית: {listing.board_fee}</p></div>)}
        {this.renderDescriptionRow(listing.publishing_user_type === 'landlord' ? 'בעל הנכס' : 'דייר יוצא', <p>{listing.publishing_user_first_name || 'אנונימי'}</p>)}
      </Col>
    );
  }
}

ListingDescription.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired
};

export default ListingDescription;
