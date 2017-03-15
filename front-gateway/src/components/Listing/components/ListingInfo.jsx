import React from 'react';
import autobind from 'react-autobind';
import { Col, Row } from 'react-bootstrap';

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
      <Col sm={3} xs={6} className="listing-info-item">
        <svg className="listing-info-item-image"><use xlinkHref={'#' + svgName} /></svg>
        <div className="listing-info-item-text">{title}</div>
      </Col>
    );
  }

  render() {
    const { listing } = this.props;

    return (
      <Row className="listing-info-container">
        {this.renderInfoBox(listing.apartment.building.street_name + ', ' + listing.apartment.building.city.city_name, 'dorbel_icon_location')}
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
