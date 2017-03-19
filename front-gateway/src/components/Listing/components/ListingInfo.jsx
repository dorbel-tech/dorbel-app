import React from 'react';
import autobind from 'react-autobind';
import { Col, Row } from 'react-bootstrap';
import utils from '~/providers/utils';

class ListingInfo extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  getFloorLabel(apartment) {
    let label = 'קומה ' + apartment.floor;
    if (apartment.building.floors) { label += '/' + apartment.building.floors; }
    if (apartment.building.elevator) { label += ' + מעלית'; }
    return label;
  }

  renderInfoBox(title, svgName) {
    // TODO : use Icon component
    return (
      <Col xs={3} md={2} className="listing-info-item">
        <svg className="listing-info-item-image"><use xlinkHref={'#' + svgName} /></svg>
        <div className="listing-info-item-text">{title}</div>
      </Col>
    );
  }

  render() {
    const { listing } = this.props;

    return (
      <Row className="listing-info-container">
        {this.renderInfoBox(utils.formatDate(listing.lease_start), 'dorbel_icon_calendar')}
        {this.renderInfoBox(listing.apartment.rooms + ' חדרים', 'dorbel_icon_bed')}
        {this.renderInfoBox(listing.apartment.size + ' מ"ר', 'dorbel_icon_ruler')}
        {this.renderInfoBox(this.getFloorLabel(listing.apartment), 'dorbel_icon_stairs')}
      </Row>
    );
  }
}

ListingInfo.propTypes = {
  listing: React.PropTypes.object.isRequired
};

export default ListingInfo;
