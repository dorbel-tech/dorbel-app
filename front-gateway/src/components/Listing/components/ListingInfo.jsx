import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'react-autobind';
import { Col, Row } from 'react-bootstrap';
import utils from '~/providers/utils';

const modeToInfoBoxMdSize = {
  responsive: 1,
  report: 4
};

const modeToInfoBoxXsSize = {
  responsive: 3,
  report: 4
};

const modeToInfoBoxClass = {
  responsive: 'listing-info-item',
  report: 'static-listing-info-item'
};

const modeToContainerClass = {
  responsive: 'listing-info-container',
  report: 'static-listing-info-container'
};

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
    const { mode } = this.props;
    return (
      <Col
        xs={modeToInfoBoxXsSize[mode]}
        md={modeToInfoBoxMdSize[mode]}
        className={modeToInfoBoxClass[mode]}>
        <img className="listing-info-item-image" src={'https://static.dorbel.com/images/icons/' + svgName + '.svg'} alt="" />
        <div className="listing-info-item-text">{title}</div>
      </Col>
    );
  }

  render() {
    const { listing, mode } = this.props;

    return (
      <Row className={modeToContainerClass[mode]}>
        {(listing.status === 'listed') && this.renderInfoBox(utils.formatDate(listing.lease_start), 'dorbel-icon-date')}
        {this.renderInfoBox(listing.apartment.rooms + ' חדרים', 'dorbel-icon-rooms')}
        {this.renderInfoBox(listing.apartment.size + ' מ"ר', 'dorbel-icon-sqm')}
        {this.renderInfoBox(this.getFloorLabel(listing), 'dorbel-icon-stairs')}
      </Row>
    );
  }
}

ListingInfo.defaultProps = {
  mode: 'responsive'
};

ListingInfo.propTypes = {
  listing: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired
};

export default ListingInfo;
