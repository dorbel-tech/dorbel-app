import React, { Component } from 'react';
import { inject } from 'mobx-react';
import autobind from 'react-autobind';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import FormWrapper, { FRC } from '~/components/FormWrapper/FormWrapper';
import SteppedProgressBar from '../../SteppedProgressBar/SteppedProgressBar';
import moment from 'moment';

import './LeaseStats.scss';

const ONE_MILLION = 1000000;
const ROOM_IN_TLV_VALUE = 900000;
const ROOM_OUTSIDE_TLV_VALUE = 500000;
const TLV_CITY_ID = 1;
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
      const roomValue = listing.apartment.building.city_id == TLV_CITY_ID ? ROOM_IN_TLV_VALUE : ROOM_OUTSIDE_TLV_VALUE;
      return roomValue * listing.apartment.rooms;
    }
  }

  formatMoneyValue(value) {
    if (value >= ONE_MILLION) {
      return `${(value / ONE_MILLION).toFixed(1)} מ'₪`;
    }
    else { return `₪${value.toLocaleString()}`; }
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

  showUpdatePropertyValuePopup(propertyValue) {
    const { modalProvider, listingsProvider } = this.props.appProviders;
    modalProvider.show({
      title: 'עדכון שווי נכס',
      body: (
        <div>
          <FormWrapper.Wrapper ref={ref => this.form = ref} layout="vertical">
            <span>עדכנו את שווי הנכס לקבלת חישוב תשואה מדוייקת עבור הנכס שלכם</span>
            <FRC.Input
              value={propertyValue.toLocaleString()}
              name="property_value"
              onChange={(inputName, inputVal) => {
                const formsy = this.form.refs.formsy;
                const currentModel = formsy.getModel();
                inputVal = parseInt(inputVal.replace(/[^0-9\.]+/g, '')) || '';
                currentModel[inputName] = inputVal.toLocaleString();
                formsy.reset(currentModel);
              }} />
            <Button
              bsStyle="success"
              onClick={() => {
                const formsy = this.form.refs.formsy;
                let { property_value } = formsy.getModel();
                property_value = parseInt(property_value.replace(/[^0-9\.]+/g, ''));
                if (property_value) {
                  listingsProvider.updateListing(this.props.listing.id, { property_value })
                    .then(modalProvider.close());
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

    // In moment JS december is represented as 0 and in case it is 0, the year will go year-1 
    let momentJsMonth = month;
    let momentJsYear = year;
    if (month == 12) {
      momentJsMonth = 0;
      momentJsYear = parseInt(year) + 1;
    }

    const leaseStart = moment(listing.lease_start);
    const leaseEnd = moment(listing.lease_end);
    const reportDate = moment({ year: momentJsYear, month: momentJsMonth });
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
                  pointerText={this.formatMoneyValue(listing.monthly_rent)}
                  hideStepMarks={monthList.length >= 20} />
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
              <div className="summary-box-link" onClick={() => this.showUpdatePropertyValuePopup(propertyValue)}>
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
