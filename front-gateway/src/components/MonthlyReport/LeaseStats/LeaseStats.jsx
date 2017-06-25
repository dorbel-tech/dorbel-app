import React, { Component } from 'react';
import { inject } from 'mobx-react';
import autobind from 'react-autobind';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import FormWrapper, { FRC } from '~/components/FormWrapper/FormWrapper';
import SteppedProgressBar from '../../SteppedProgressBar/SteppedProgressBar';
import moment from 'moment';

import './LeaseStats.scss';
@inject('appProviders')
class LeaseStats extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

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

  getPropertyValue(listing) {
    if (listing.property_value) {
      return listing.property_value;
    }
    else {
      const roomValue = listing.apartment.building.city_id == 1 ? 900000 : 500000;
      return roomValue * listing.apartment.rooms;
    }
  }

  formatMoneyValue(value) {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)} מ'₪`;
    }
    else { return `₪${value.toLocaleString()}`; }
  }

  renderStatsHeader(monthsToLeaseEnd) {
    if (monthsToLeaseEnd > 0) {
      return <div className={monthsToLeaseEnd <= 2 ? 'about-to-end' : ''}>
        <img src="https://static.dorbel.com/images/icons/monthly-report/bell.svg" />
        {`נותרו ${monthsToLeaseEnd} חודשים עד תום החוזה`}
      </div>;
    }
    else {
      return <div className="ended">החוזה נגמר. פרסמו שוב את הדירה</div>;
    }
  }

  showUpdatePropertyValuePopup() {
    const { modalProvider, listingsProvider } = this.props.appProviders;
    modalProvider.show({
      title: 'עדכון שווי נכס',
      body: (
        <div>
          <FormWrapper.Wrapper ref={ref => this.form = ref} layout="vertical">
            <span>עדכנו את שווי הנכס לקבלת חישוב תשואה מדוייקת עבור הנכס שלכם</span>
            <FRC.Input type="number" name="property_value" />
            <Button
              bsStyle="success"
              onClick={() => {
                const formsy = this.form.refs.formsy;
                const { property_value } = this.form.refs.formsy.getModel();
                if (parseInt(property_value)) {
                  listingsProvider.updateListing(this.props.listing.id, { property_value })
                  .then(modalProvider.close());
                }
                else {
                  formsy.submit();
                }
              }}>
              עדכן
              </Button>
          </FormWrapper.Wrapper>
        </div>
      ),
      modalSize: 'small'
    });
  }

  render() {
    const { listing, month, year } = this.props;

    const leaseStart = moment(listing.lease_start);
    const leaseEnd = moment(listing.lease_end);
    const reportDate = moment({ year, month });

    const monthList = this.getMonthList(leaseStart, leaseEnd);
    const currentMonthIndex = reportDate.diff(leaseStart, 'months');
    const monthsToLeaseEnd = leaseEnd.diff(reportDate, 'months');

    const propertyValue = this.getPropertyValue(listing);
    const totalRentExpected = listing.monthly_rent * monthList.length;

    return (
      <Grid fluid className="lease-stats">
        <Row className="lease-stats-header">
          <Col xs={12}>
            {this.renderStatsHeader(monthsToLeaseEnd)}
          </Col>
        </Row>
        <Row className="lease-stats-details">
          <Col xs={12}>
            <Row>
              <Col xs={12}>
                <SteppedProgressBar
                  steps={monthList}
                  currentStepIndex={currentMonthIndex}
                  pointerText={'₪' + listing.monthly_rent.toLocaleString()} />
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
                  {this.formatMoneyValue(totalRentExpected)}
                </div>
              </div>
              <div className="lease-stats-details-income-paid">
                <div className="heading">
                  עד כה שולם
                  </div>
                <div className="content">
                  {this.formatMoneyValue((currentMonthIndex + 1) * listing.monthly_rent)}
                </div>
              </div>
            </Col>
          </Row>
          <Row className="lease-stats-details-income-totals">
            <Col className="summary-box" xs={4}>
              <div className="summary-box-value">
                {this.formatMoneyValue(propertyValue)}
              </div>
              <div className="summary-box-text">
                שווי הנכס (מוערך)
              </div>
              <div className="summary-box-link" onClick={this.showUpdatePropertyValuePopup}>
                עדכן שווי נכס
              </div>
            </Col>
            <Col className="summary-box" xs={4}>
              <div className="summary-box-value">
                {this.formatMoneyValue(totalRentExpected)}
              </div>
              <div className="summary-box-text">
                הכנסה
                <br />
                שנתית
              </div>
            </Col>
            <Col className="summary-box" xs={4}>
              <div className="summary-box-value">
                {(totalRentExpected / propertyValue * 100).toFixed(3) + '%'}
              </div>
              <div className="summary-box-text">
                תשואה
                <br />
                שנתית
              </div>
            </Col>
          </Row>
        </Row >
      </Grid >
    );
  }
}

LeaseStats.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object.isRequired,
  listing: React.PropTypes.object.isRequired,
  month: React.PropTypes.string.isRequired,
  year: React.PropTypes.string.isRequired
};

export default LeaseStats;
