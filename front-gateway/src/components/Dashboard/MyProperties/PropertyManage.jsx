import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ProgressBar, Col, Grid, Row } from 'react-bootstrap';
import autobind from 'react-autobind';
import DatePicker from '~/components/DatePicker/DatePicker';
import utils from '~/providers/utils';
import moment from 'moment';

import './PropertyManage.scss';

@inject('appProviders') @observer
class PropertyManage extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  leaseStartChange(leaseStart) {
    this.newLeaseStart = leaseStart;
  }

  leaseEndChange(leaseEnd) {
    this.newLeaseEnd = leaseEnd;
  }

  editLeaseDates() {
    const { listing } = this.props;
    const { listingsProvider, modalProvider } = this.props.appProviders;
    this.newLeaseStart = null;
    this.newLeaseEnd = null;

    const modalBody = <div className="property-manage-modal-body">
        <div className="property-manage-modal-section-header">
          עדכנו את מועדי תחילת ותום השכירות
        </div>
        <div>
          <div className="property-manage-modal-picker-label">תחילת השכירות</div>
          <div className="property-manage-modal-picker-label">תום השכירות</div>
        </div>
        <div className="property-manage-modal-picker-container">
          <div className="property-manage-modal-start-picker-wrapper">
            <DatePicker value={listing.lease_start}
                        onChange={this.leaseStartChange}
                        calendarPlacement="bottom" />
          </div>
          <div className="property-manage-modal-end-picker-separator">-</div>
          <div className="property-manage-modal-end-picker-wrapper">
            <DatePicker value={listing.lease_end}
                        onChange={this.leaseEndChange}
                        calendarPlacement="bottom" />
          </div>
        </div>
      </div>;

    modalProvider.showConfirmationModal({
      title: 'עדכון תקופת שכירות',
      body: modalBody,
      confirmButton: 'עדכן פרטים',
      confirmStyle: 'success'
    }).then(choice => {
      if (choice) {
        return listingsProvider.updateListing(listing.id,
          {
            lease_start: this.newLeaseStart || listing.lease_start,
            lease_end: this.newLeaseEnd || listing.lease_end
          });
      }
    }).catch((err) => this.props.appProviders.notificationProvider.error(err));
  }

  render() {
    const { listing } = this.props;
    const listingLeaseStart = utils.formatDate(listing.lease_start);
    const listingLeaseEnd = utils.formatDate(listing.lease_end);
    const listingSet = listing.lease_end && listing.lease_start;
    const leasePeriod = listingSet ? moment(listing.lease_start).diff(moment(listing.lease_end), 'days') : false;
    const daysPassed = listingSet ? moment(listing.lease_start).diff(moment(), 'days') : false;
    const daysLeft = listingSet ? leasePeriod - daysPassed : false;
    const leasePeriodLabel = leasePeriod || '-';
    const daysPassedLabel = daysPassed || '-';
    const daysLeftLabel = daysLeft || '-';

    return  <Grid fluid className="property-manage">
              <Row className="property-manage-lease-title">
                <Col xs={12}>
                  מידע על השכירות:
                </Col>
              </Row>
              <Row className="property-manage-lease-period">
                <Col xs={12}>
                  <div>
                    משך תקופת שכירות נוכחית: {leasePeriodLabel} ימים
                  </div>
                  <div onClick={this.editLeaseDates}>
                    + הוספת מועדי תחילת ותום שכירות
                  </div>
                  <div>
                    <span>{listingLeaseStart}</span>
                    <ProgressBar now={0}/>
                    <span>{listingLeaseEnd}</span>
                  </div>
                  <div>
                    תחילת שכירות
                    {daysLeftLabel} ימים נותרו
                    תום שכירות
                  </div>
                </Col>
              </Row>
            </Grid>;
  }
}

PropertyManage.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object.isRequired,
  listing: React.PropTypes.object.isRequired
};

export default PropertyManage;
