import React from 'react';
import autobind from 'react-autobind';
import { Col, Row } from 'react-bootstrap';
import utils from '~/providers/utils';

class ListingInfo extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  getFloorLabel(listing) {
    let label = 'קומה ' + utils.getFloorTextValue(listing);
    const elevator = listing.apartment.building.elevator;
    if (elevator) { label += ' + מעלית'; }

    return label;
  }

  renderInfoBox(title, svgName) {
    return (
      <Col xs={3} md={1} className="listing-info-item">
        <img className="listing-info-item-image" src={'https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/icons/' + svgName + '.svg'} alt="" />
        <div className="listing-info-item-text">{title}</div>
      </Col>
    );
  }

  render() {
    const { listing } = this.props;

    return (
      <Row className="listing-info-container">
        {this.renderInfoBox(utils.formatDate(listing.lease_start), 'dorbel-icon-date')}
        {this.renderInfoBox(listing.apartment.rooms + ' חדרים', 'dorbel-icon-rooms')}
        {this.renderInfoBox(listing.apartment.size + ' מ"ר', 'dorbel-icon-sqm')}
        {this.renderInfoBox(this.getFloorLabel(listing), 'dorbel-icon-stairs')}
      </Row>
    );
  }
}

ListingInfo.propTypes = {
  listing: React.PropTypes.object.isRequired
};

export default ListingInfo;
