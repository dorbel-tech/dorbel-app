import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { ProgressBar, Col, Grid, Row } from 'react-bootstrap';
import utils from '~/providers/utils';
import moment from 'moment';

import './PropertyManage.scss';

@inject('appProviders') @observer
class PropertyManage extends Component {
  render() {
    const { listing } = this.props;
    const listingLeaseStart = utils.formatDate(listing.lease_start);
    const listingLeaseEnd = utils.formatDate(listing.lease_end);

    let daysPassed;
    if (listing.lease_end && listing.lease_start) {
      daysPassed = moment(listing.lease_start).diff(moment(listing.lease_end), 'days');
    } else {
      daysPassed = false;
    }
    const daysPassedLabel = daysPassed || '---';

    return  <Grid fluid className="property-manage">
              <Row className="property-manage-lease-title">
                <Col xs={12}>
                  מידע על השכירות:
                </Col>
              </Row>
              <Row className="property-manage-lease-period">
                <Col xs={12}>
                  <div>
                    משך תקופת שכירות נוכחית: {daysPassedLabel} ימים
                  </div>
                  <div>
                    + הוספת מועדי תחילת ותום שכירות
                  </div>
                  <div>
                    <span>{listingLeaseStart}</span>
                    <ProgressBar now={0}/>
                    <span>{listingLeaseEnd}</span>
                  </div>
                  <div>
                    תחילת שכירות
                    {daysPassedLabel} ימים נותרו
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
