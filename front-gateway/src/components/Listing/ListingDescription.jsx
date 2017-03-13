import React from 'react';
import { observer } from 'mobx-react';
import { Col, Grid, Row } from 'react-bootstrap';
import ListingAmenities from './ListingAmenities.jsx';

@observer(['appProviders'])
class ListingDescription extends React.Component {
  renderDescriptionRow(titleText, innerContent) {
    return <Row className="property-desc">
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
      <Grid fluid className="apt-info-container">
        <Grid>
          <Col lg={9}>
            {this.renderDescriptionRow('תאריך כניסה', <p>{this.props.appProviders.utils.formatDate(listing.lease_start)}</p>)}
            {this.renderDescriptionRow('תאור הנכס', <p>{listing.description}</p>)}
            <ListingAmenities listing={listing} />
            {this.renderDescriptionRow('פרטי תשלום', <div><p>ארנונה: {listing.property_tax}</p><p>ועד הבית: {listing.board_fee}</p></div>)}
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
