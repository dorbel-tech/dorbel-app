import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ProgressBar, Col, Grid, Row } from 'react-bootstrap';
import ManageLeaseModal from './ManageLeaseModal';
import autobind from 'react-autobind';
import utils from '~/providers/utils';
import moment from 'moment';

import './PropertyManage.scss';

@inject('appProviders') @observer
class PropertyManage extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      showManageLeaseModal: false
    };
  }

  closeManageLeaseModal(newLeaseStart, newLeaseEnd) {
    this.setState({showManageLeaseModal: false});
  }

  editLeaseDates() {
    this.setState({showManageLeaseModal: true});
//      if (choice) {
//        return listingsProvider.updateListing(listing.id,
//          {
//            lease_start: this.newLeaseStart || listing.lease_start,
//            lease_end: this.newLeaseEnd || listing.lease_end
//          });
//      }


//    }).catch((err) => this.props.appProviders.notificationProvider.error(err));
  }

  render() {
    const { listing } = this.props;
    const listingLeaseStart = utils.formatDate(listing.lease_start);
    const listingLeaseEnd = utils.formatDate(listing.lease_end);
    const leasePeriod = moment(listing.lease_end).diff(moment(listing.lease_start), 'days');
    const daysPassed = moment().diff(moment(listing.lease_start), 'days');
    const daysLeft = leasePeriod - daysPassed;
    const leasePeriodLabel = leasePeriod || '-';
    const daysPassedLabel = daysPassed < 0 ? 0 : daysPassed;
    const daysLeftLabel = daysLeft || '-';

    return  <Grid fluid className="property-manage">
              <Row className="property-manage-lease-title">
                <Col xs={12}>
                  מידע על השכירות:
                </Col>
              </Row>
              <Row className="property-manage-lease-period">
                <ManageLeaseModal listing={listing}
                                  show={this.state.showManageLeaseModal}
                                  onClose={this.closeManageLeaseModal}/>
                <Col xs={12}>
                  <div>
                    תקופת השכירות: {leasePeriodLabel} ימים
                  </div>
                  <div className="property-manage-lease-period-edit"
                       onClick={this.editLeaseDates}>
                    <i className="property-manage-lease-period-edit-icon fa fa-pencil-square-o"  aria-hidden="true"></i>
                    עריכה
                  </div>
                  <div className="property-manage-lease-period-start">{listingLeaseStart}</div>
                  <div className="property-manage-lease-period-start-label">תחילת שכירות</div>
                  <div className="property-manage-lease-period-days-passed">{daysPassedLabel} ימים עברו</div>
                  <ProgressBar now={daysPassed <= 0 ? (leasePeriod / 100) : daysPassed} max={leasePeriod}/>
                  <div className="property-manage-lease-period-days-left">{daysLeftLabel} ימים נותרו</div>
                  <div className="property-manage-lease-period-end">{listingLeaseEnd}</div>
                  <div className="property-manage-lease-period-end-label">תום שכירות</div>
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
