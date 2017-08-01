import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Grid, Row, Col } from 'react-bootstrap';
import SteppedProgressBar from '../../SteppedProgressBar/SteppedProgressBar';
import PropertyValueBox from './SummaryBox/Instances/PropertyValueBox';
import AnnualIncomeBox from './SummaryBox/Instances/AnnualIncomeBox';
import AnnualYieldBox from './SummaryBox/Instances/AnnualYieldBox';
import LeaseStatsVM from './LeaseStatsVM.js';

import './LeaseStats.scss';

class LeaseStats extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  renderStatsHeader(monthsToLeaseEnd) {
    let className = '';
    let imgSrc = 'https://static.dorbel.com/images/icons/monthly-report/bell.svg';
    let text = `נותרו ${monthsToLeaseEnd} חודשים עד תום החוזה`;

    if (monthsToLeaseEnd <= 0) {
      className = 'ended';
      imgSrc = 'https://static.dorbel.com/images/icons/monthly-report/bell-ended.svg';
      text = 'החוזה נגמר. פרסמו שוב את הדירה';
    }
    else if (monthsToLeaseEnd <= 2) {
      className = 'near-end';
      imgSrc = 'https://static.dorbel.com/images/icons/monthly-report/bell-near-end.svg';
    }

    return (
      <div className={className}>
        <img src={imgSrc} />
        {text}
      </div>
    );
  }

  render() {
    const { listing, month, year } = this.props;
    const statsVM = new LeaseStatsVM(listing, month, year);

    return (
      <Grid fluid className="lease-stats">
        <Row className="lease-stats-header">
          <Col xs={12}>
            {this.renderStatsHeader(statsVM.monthsToLeaseEnd)}
          </Col>
        </Row>
        <Row className="lease-stats-details">
          <Col xs={12}>
            <Row>
              <Col xs={12}>
                <SteppedProgressBar
                  steps={statsVM.monthList.map((item) => { return item.month; })}
                  currentStepIndex={statsVM.currentMonthIndex}
                  pointerText={statsVM.monthlyRentFormatted}
                  hideStepMarks={statsVM.monthList.length >= 20} />
              </Col>
            </Row>
          </Col>
          <Row className="lease-stats-details-income">
            <Col xs={12}>
              <div className="lease-stats-details-income-remaining">
                <div className="heading">
                  נותר לתשלום
                  </div>
                <div className="content">
                  {statsVM.rentRemainingFormatted}
                </div>
              </div>
              <div className="lease-stats-details-income-paid">
                <div className="heading">
                  עד כה שולם
                  </div>
                <div className="content">
                  {statsVM.rentPayedFormatted}
                </div>
              </div>
            </Col>
          </Row>
          <Row className="lease-stats-details-income-totals">
            <Col xs={4}>
              <PropertyValueBox leaseStatsVM={statsVM} />
            </Col>
            <Col xs={4}>
              <AnnualIncomeBox leaseStatsVM={statsVM} />
            </Col>
            <Col xs={4}>
              <AnnualYieldBox leaseStatsVM={statsVM} />
            </Col>
          </Row>
        </Row >
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
