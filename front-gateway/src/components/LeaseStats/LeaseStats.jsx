import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import SteppedProgressBar from '../SteppedProgressBar/SteppedProgressBar';
import moment from 'moment';

class LeaseStats extends Component {

  getMonthList(leaseStart, leaseEnd) {
    let start = leaseStart.clone();
    let end = leaseEnd.clone();

    let monthList = [];
    while (start < end) {
      monthList.push(start.month() + 1);
      start.add(1, 'month');
    }

    return monthList;
  }

  getCurrentMonthIndex(year, month, leaseStart) {
    return moment({ year, month }).diff(leaseStart, 'months');
  }

  render() {
    const { listing, month, year } = this.props;

    const leaseStart = moment(listing.lease_start);
    const leaseEnd = moment(listing.lease_end);

    return (
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <SteppedProgressBar
              steps={this.getMonthList(leaseStart, leaseEnd)}
              currentStepIndex={this.getCurrentMonthIndex(year, month, leaseStart)}
              pointerText={'₪' + listing.monthly_rent.toLocaleString()} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

LeaseStats.propTypes = {
  listing: React.PropTypes.object.isRequired,
  month: React.PropTypes.string.isRequired,
  year: React.PropTypes.string.isRequired
};

export default LeaseStats;
