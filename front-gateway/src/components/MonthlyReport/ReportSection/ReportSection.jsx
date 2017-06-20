import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

import './ReportSection.scss';

class ReportSection extends Component {
  static hideFooter = true;
  static hideHeader = true;


  static serverPreRender(props) {
    return props.appProviders.listingsProvider.loadFullListingDetails(props.listingId);
  }

  render() {
    return (
      <Row className='report-section'>
        <Col xs={2} className="report-section-heading">
          <div className="report-section-marker" />
          <div className="report-section-title">
            <img className="report-section-title-icon" src={this.props.iconSrc} />
            <div className="report-section-title-text">
              {this.props.title}
            </div>
          </div>
        </Col>
        <Col xs={10} className="report-section-body-wrapper">
          {this.props.body}
        </Col>
      </Row>
    );
  }
}

ReportSection.propTypes = {
  iconSrc: React.PropTypes.string,
  title: React.PropTypes.node,
  body: React.PropTypes.node
};


export default ReportSection;
