import React from 'react';
import { observer } from 'mobx-react';
import { Col, Grid, Row } from 'react-bootstrap';
import ListingAmenities from './ListingAmenities.jsx';

@observer(['appProviders'])
class ListingDescription extends React.Component {
  render() {
    const { listing } = this.props;

    return (
      <Grid fluid className="apt-info-container">
        <Grid>
          <Col lg={9}>
            <Row className="property-desc">
              <Col md={2}>
                <h5>תאריך כניסה</h5>
              </Col>
              <Col md={10}>
                <p>{this.props.appProviders.utils.formatDate(listing.lease_start)}</p>
              </Col>
            </Row>
            <Row className="property-desc">
              <Col md={2}>
                <h5>תאור הנכס</h5>
              </Col>
              <Col md={10}>
                <p>{listing.description}</p>
              </Col>
            </Row>
            <ListingAmenities listing={listing} />
            <Row className="property-desc">
              <Col md={2}>
                <h5>פרטי תשלום</h5>
              </Col>
              <Col md={10}>
                <p>ארנונה: {listing.property_tax}</p>
                <p>ועד הבית: {listing.board_fee}</p>
              </Col>
            </Row>
          </Col>
        </Grid>
      </Grid>
    );
  }
}

ListingDescription.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired
};

export default ListingDescription;
