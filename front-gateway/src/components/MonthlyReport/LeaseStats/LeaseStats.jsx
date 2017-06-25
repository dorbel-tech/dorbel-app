import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import SteppedProgressBar from '../../SteppedProgressBar/SteppedProgressBar';
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

  getStatsHeader(monthsToLeaseEnd) {
    if (monthsToLeaseEnd >= 0) {
      const className = monthsToLeaseEnd > 2 ? '' : 'about-to-end';
      return <div className={className}>{`נותרו ${monthsToLeaseEnd} חודשים עד תום החוזה`}</div>;
    }
    else {
      return <div className="">{`נותרו ${monthsToLeaseEnd} חודשים עד תום החוזה`}</div>;
    }
  }

  render() {
    const { listing, month, year } = this.props;

    const leaseStart = moment(listing.lease_start);
    const leaseEnd = moment(listing.lease_end);
    const reportDate = moment({ year, month });

    const currentMonthIndex = reportDate.diff(leaseStart, 'months');
    const monthsToLeaseEnd = leaseEnd.diff(reportDate, 'months');

    return (
      <Grid fluid className="lease-stats">
        <Row className="lease-stats-header">
          <Col xs={12}>
            {this.getStatsHeader(monthsToLeaseEnd)}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <SteppedProgressBar
              steps={this.getMonthList(leaseStart, leaseEnd)}
              currentStepIndex={currentMonthIndex}
              pointerText={'₪' + listing.monthly_rent.toLocaleString()} />
          </Col>
        </Row>
      </Grid >
    );
  }
}

LeaseStats.propTypes = {
  listing: React.PropTypes.object.isRequired,
  month: React.PropTypes.string.isRequired,
  year: React.PropTypes.string.isRequired
};

export default LeaseStats;
